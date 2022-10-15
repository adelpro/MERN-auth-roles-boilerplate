import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styles from "../../App.module.css";
import useLocalStorage from "../../hooks/useLocalStorage";
import { AccessToken } from "../../recoil/atom";
import { useParams } from "react-router-dom";
import { MdAutorenew, MdEditNote, MdSystemUpdateAlt } from "react-icons/md";
export default function EditUserForm() {
  const [accessToken, setAccessToken] = useRecoilState(AccessToken);
  const [persist] = useLocalStorage("persist", false);
  const messageRef = useRef();
  const [isloading, setIsloading] = useState(false);
  const [message, setMessage] = useState(null);
  const { id } = useParams();
  //TODO migrate all fetch api to axios private in edit and new user
  //TODO working on second password check
  const schema = yup.object().shape({
    username: yup.string().min(4).required("Username is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    //password: yup.string().min(6, "Min 6 characters"),
    //.required("Password is required"),
    //confirmationPassword: yup.string().oneOf([yupref("password"), null]),
    roles: yup
      .array()
      .min(1, "Please select at least one role")
      .required("Required: Please select at least one role"),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    //shouldUseNativeValidation: true,
    resolver: yupResolver(schema),
  });
  //fetching default user data with id:
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASEURL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json ",
        authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        if (res.status === 403 && persist) {
          //Refresh token only on trusted devices
          fetch(`${process.env.REACT_APP_BASEURL}/auth/refresh`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json ",
              authorization: `Bearer ${accessToken}`,
            },
          })
            .then((res) => {
              return res.json();
            })
            .then((result) => {
              setAccessToken(result.accessToken);
              setIsloading(false);
              setMessage(null);
            });
        }
        return res.json();
      })
      .then((result) => {
        const UserToEdit = result.find((item) => (item._id = id));
        const { username, email, roles, active } = UserToEdit;
        reset({ username, email, roles, active });
        setMessage(null);
        setIsloading(false);
      })

      .catch((err) => {
        setIsloading(false);
        setMessage(err);
      });
  }, [accessToken, id, persist, reset, setAccessToken]);

  const onSubmit = async (data) => {
    setIsloading(true);
    setMessage(null);
    const { username, password, email, roles, active } = data;
    let body = null;

    if (password) {
      body = JSON.stringify({ ...data, id });
    } else {
      body = JSON.stringify({ id, username, email, roles, active });
    }
    fetch(`${process.env.REACT_APP_BASEURL}/users`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json ",
      },
      body,
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        setIsloading(false);
        setMessage(result.message);
      })
      .catch((err) => {
        if (!err.status) {
          setMessage(err.statusText ? err.statusText : "No server response");
        } else if (err.status === 409) {
          setMessage("Username exist already");
        } else if (err.status === 401) {
          setMessage("Unauthorized");
        } else {
          setMessage(err.statusText);
        }
        setIsloading(false);
      });
  };

  if (isloading) return <p>Loading ...</p>;
  return (
    <section>
      <div className={styles.center}>
        <MdSystemUpdateAlt size={30} style={{ marginRight: 10 }} />
        <h1>Update user</h1>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.form__container}
      >
        <div className={styles.form__control__container}>
          <label htmlFor="username">Username</label>
          <input {...register("username")} type="text" />
        </div>
        {errors?.username && <p>{errors?.username?.message}</p>}
        <div className={styles.form__control__container}>
          <label htmlFor="password">Password</label>
          <input type="password" {...register("password")} />
        </div>
        {errors?.password && <p>{errors?.password?.message}</p>}
        <div className={styles.form__control__container}>
          <label htmlFor="email">Email</label>
          <input {...register("email")} type="text" />
        </div>
        {errors?.email && <p>{errors?.email?.message}</p>}
        <div className={styles.form__control__container}>
          <label htmlFor="roles">Roles</label>
          <select multiple={true} size={3} {...register("roles")}>
            <option value={"Admin"}>Admin</option>
            <option value={"Manager"}>Manager</option>
            <option value={"Employee"}>Employee</option>
          </select>
        </div>
        {errors?.roles && <p>{errors?.roles?.message}</p>}
        <div className={styles.form__control__container}>
          <button type="submit" disabled={isloading} className={styles.button}>
            <div className={styles.center}>
              <MdEditNote size={30} style={{ marginRight: 10 }} />
              {isloading ? "Loading..." : "Update"}
            </div>
          </button>
          <button onClick={() => reset()} className={styles.button}>
            <div className={styles.center}>
              <MdAutorenew size={30} style={{ marginRight: 10 }} />
              Reset
            </div>
          </button>
        </div>
        <p ref={messageRef} aria-live="assertive">
          {message && JSON.stringify(message)}
        </p>
      </form>
    </section>
  );
}
