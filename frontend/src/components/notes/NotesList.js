import React from "react";
import { useRecoilValue } from "recoil";
import useFetchWithRefechToken from "../../hooks/useFetchWithRefrechToken";
import { AccessToken } from "../../recoil/atom";

export default function NotesList() {
  const accessToken = useRecoilValue(AccessToken);
  const { isLoading, error, data } = useFetchWithRefechToken("notes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json ",
      authorization: `Bearer ${accessToken}`,
    },
  });
  if (error) return <div>{error?.message}</div>;
  if (isLoading) return <div>Loading...</div>;
  if (!data || !data.length)
    return (
      <>
        <div>No data to show</div>
      </>
    );
  console.log(data);
  return <div>data...</div>;
}
