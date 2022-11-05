import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styles from "../../App.module.css";
import { AccessToken } from "../../recoil/atom";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { MdAutorenew, MdEditNote, MdSystemUpdateAlt } from "react-icons/md";
export default function EditUserForm() {
  const axiosPrivate = useAxiosPrivate();
  const [accessToken] = useRecoilState(AccessToken);
  const messageRef = useRef();
  const [isloading, setIsloading] = useState(false);
  const [message, setMessage] = useState(null);
  const { id } = useParams();
  const schema = yup.object().shape({
    title: yup.string().min(4).required("Title is required"),
    text: yup.string().min(10).required("Text is required"),
    completed: yup.boolean(),
    user: yup.string(),
    id: yup.string(),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  //Fetching default note data with id:at component mount
  useEffect(() => {
    setIsloading(true);
    const controller = new AbortController();
    const getNote = async () => {
      try {
        const result = await axiosPrivate.post(
          "/notes/one",
          { id },
          {
            signal: controller.signal,
          }
        );
        const { _id, user, title, text, completed } = result?.data;
        reset({ id: _id, user, title, text, completed });
        setMessage(null);
      } catch (err) {
        setMessage(err?.response?.message);
      } finally {
        setIsloading(false);
      }
    };
    if (accessToken) getNote();
    return () => {
      controller?.abort();
    };
  }, [axiosPrivate, accessToken, id, reset]);

  const onSubmit = async (data) => {
    setIsloading(true);
    setMessage(null);
    console.log(data);
    await axiosPrivate
      .patch(`/notes`, data)

      .then((result) => {
        setIsloading(false);
        setMessage(result?.response?.message);
      })
      .catch((err) => {
        if (!err?.response?.status) {
          setMessage(
            err?.response?.statusText
              ? err?.response?.statusText
              : "No server response"
          );
        } else if (err.status === 409) {
          setMessage("Username exist already");
        } else if (err?.response?.status === 401) {
          setMessage("Unauthorized");
        } else {
          setMessage(err?.response?.statusText);
        }
        setIsloading(false);
      });
  };

  if (isloading) return <p>Loading ...</p>;
  return (
    <section>
      <div className={styles.center}>
        <MdSystemUpdateAlt size={30} style={{ marginRight: 10 }} />
        <h1>Update Note</h1>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.form__container}
      >
        <input {...register("id")} type="hidden" />
        <input {...register("user")} type="hidden" />
        <div className={styles.form__control__container}>
          <label htmlFor="title">Text</label>
          <input {...register("title")} type="text" />
        </div>
        {errors?.title && <p>{errors?.title?.message}</p>}
        <div className={styles.form__control__container}>
          <label htmlFor="text">Text</label>
          <input type="text" {...register("text")} />
        </div>
        {errors?.text && <p>{errors?.text?.message}</p>}
        <div className={styles.form__control__container__checkbox}>
          <input type="checkbox" {...register("completed")} />
          <label htmlFor="completed">Completed</label>
        </div>
        {errors?.completed && <p>{errors?.completed?.message}</p>}
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
