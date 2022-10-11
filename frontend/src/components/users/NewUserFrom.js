import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styles from "./NewUserFrom.module.css";

export default function NewUserFrom() {
  const messageRef = useRef();
  const [isloading, setIsloading] = useState(false);
  const [message, setMessage] = useState(null);

  const schema = yup.object().shape({
    username: yup.string().min(4).required("Username is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(6, "Min 6 characters")
      .required("Password is required"),
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
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    setIsloading(true);
    setMessage(null);
    const body = JSON.stringify(data);
    fetch(`${process.env.REACT_APP_BASEURL}/users`, {
      method: "POST",
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
    <>
      <h1>Singup</h1>
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
          <button type="submit" disabled={isloading}>
            {isloading ? "Loading..." : "Submit"}
          </button>
          <button onClick={() => reset()}>Reset</button>
        </div>
        <p ref={messageRef} aria-live="assertive">
          {message && JSON.stringify(message)}
        </p>
      </form>
    </>
  );
}
