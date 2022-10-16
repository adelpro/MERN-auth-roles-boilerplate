import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MdAdd, MdAutorenew, MdNoteAdd } from "react-icons/md";
import styles from "../../App.module.css";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Ring } from "@uiball/loaders";
import { useLocation, useNavigate } from "react-router-dom";

export default function NewNoteForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const messageRef = useRef();
  const [isloading, setIsloading] = useState(false);
  const [message, setMessage] = useState(null);
  const schema = yup.object().shape({
    title: yup.string().min(4).required("Title is required"),
    text: yup.string().min(10).required("Text is required"),
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
    await axiosPrivate
      .post("/notes", { ...data, user: id })
      .then((result) => {
        setIsloading(false);
        setMessage(result?.data?.message);
        navigate(location.state?.from?.pathname || "/dash/notes", {
          replace: true,
        });
      })
      .catch((err) => {
        if (!err?.response?.status) {
          setMessage(
            err?.response?.statusText
              ? err?.response?.statusText
              : "No server response"
          );
        } else if (err?.response?.status === 400) {
          setMessage("Verify your data and proceed again");
        } else {
          setMessage(err?.response?.statusText);
        }
        setIsloading(false);
      });
  };

  if (isloading) return <p>Loading ...</p>;
  return (
    <section>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MdNoteAdd size={30} style={{ marginRight: 10 }} />
        <h1>Add new note</h1>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.form__container}
      >
        <div className={styles.form__control__container}>
          <label htmlFor="title">Title</label>
          <input {...register("title")} type="text" />
        </div>
        {errors?.title && <p>{errors?.title?.message}</p>}
        <div className={styles.form__control__container}>
          <label htmlFor="text">Text</label>
          <textarea rows="5" type="text" {...register("text")} />
        </div>
        {errors?.text && <p>{errors?.text?.message}</p>}

        <div className={styles.form__control__container}>
          <button type="submit" disabled={isloading} className={styles.button}>
            {!isloading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MdAdd size={30} style={{ marginRight: 10 }} />
                Add
              </div>
            ) : (
              <div className={styles.center}>
                {<Ring size={18} color="white" />}
              </div>
            )}
          </button>
          <button onClick={() => reset()} className={styles.button}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
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
