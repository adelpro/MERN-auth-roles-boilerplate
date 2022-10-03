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
    username: yup
      .string()
      .min(4)
      .max(15)
      .required("Username is required"),
    //email:yup.string().email("Invalid email").required("Email is required")
    password: yup
      .string()
      .min(6, "Min 6 characters")
      .required("Password is required"),
    //confirmationPassword: yup.string().oneOf([yupref("password"), null]),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    shouldUseNativeValidation: true,
  });
  const onSubmit = async (data) => {
    setIsloading(true);
    setMessage(null);
    console.log({ data });
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
          <input
            {...register("username", {
              required: "Please enter your username.",
              minLength: {
                value: 3,
                message: "Length must be at least 3 characters.",
              },
            })}
          />
          {errors.username}
        </div>
        <div className={styles.form__control__container}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Please enter your password.",
              minLength: {
                value: 6,
                message: "Minimum password length is 6 characters",
              },
            })}
          />
          {errors.Password}
        </div>

        <div className={styles.form__control__container}>
          <label htmlFor="roles">Roles</label>
          <select
            multiple={true}
            size={3}
            {...register("roles", {
              required: "Please select at least one role",
            })}
          >
            <option value={"Admin"}>Admin</option>
            <option value={"Manager"}>Manager</option>
            <option value={"Employee"}>Employee</option>
          </select>
        </div>
        <div className={styles.form__control__container}>
          <button type="submit" variant="contained">
            Submit
          </button>
        </div>
        <p ref={messageRef} aria-live="assertive">
          {message}
        </p>
      </form>
    </>
  );
}
