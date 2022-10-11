import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useRecoilValue } from "recoil";
import { AccessToken } from "../../recoil/atom";
export default function Welcome() {
  const accessToken = useRecoilValue(AccessToken);
  const { username, status, isAdmin } = useAuth();
  return (
    <>
      <p>
        Welcome {username} [ {status} ]
      </p>
      <p>accessToken: {accessToken}</p>
      <p>Current server: {process.env.REACT_APP_BASEURL}</p>
      <p>
        <Link to="/dash/notes"> View Notes</Link>
      </p>
      {isAdmin && (
        <p>
          <Link to="/dash/users"> View Users</Link>
        </p>
      )}
    </>
  );
}
