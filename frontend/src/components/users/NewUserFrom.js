import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FormControl,
  InputLabel,
  Input,
  Button,
  FormGroup,
  FormLabel,
} from "@mui/material";
export default function NewUserFrom() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    shouldUseNativeValidation: true,
  });
  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);

    const body = JSON.stringify({
      username: "adddd",
      password: "ddddddd",
      roles: ["admin"],
    });

    fetch("http://localhost:3500/users", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json ",
      },
      body: JSON.stringify({
        username: "addddffffff",
        password: "ddddddd",
        roles: ["admin"],
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log("eee");
        setError(err);
        console.log({ err });
      });
  };
  if (isLoading) return <p>Loading</p>;
  if (error) return <p>{error}</p>;
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormLabel component="legend">Signup</FormLabel>
      <FormGroup>
        <FormGroup>
          <FormControl
            sx={{
              padding: 2,
              margin: 2,
            }}
          >
            <InputLabel htmlFor="username">username</InputLabel>
            <Input
              {...register("username", {
                required: "Please enter your username.",
                minLength: 3,
              })}
            />

            {errors.username && errors.username.type === "minLength" && (
              <span>Min length is 3 characters</span>
            )}
          </FormControl>
          <FormControl
            sx={{
              padding: 2,
              margin: 2,
            }}
          >
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              type="password"
              {...register("password", {
                required: "Please enter your password.",
                minLength: 6,
              })}
            />
            {errors.Password && errors.Password.type === "minLength" && (
              <span>Min length is 6 characters</span>
            )}
          </FormControl>
          <FormControl>
            <select
              multiple={true}
              size={3}
              {...register("roles", {
                required: "Please select at least one role.",
              })}
            >
              <option value={"Admin"}>Admin</option>
              <option value={"User"}>User</option>
            </select>
          </FormControl>
        </FormGroup>
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </FormGroup>
    </form>
  );
}
