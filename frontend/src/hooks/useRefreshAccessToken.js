import axios from "../api/axios";

const useRefreshAccessToken = () => {
  const getNewToken = async () => {
    let refreshToken = null;
    await axios
      .get("/auth/refresh", {
        withCredentials: true,
      })
      .then((response) => {
        refreshToken = response.data.accessToken;
      });
    return refreshToken;
  };
  return getNewToken;
};
export default useRefreshAccessToken;
