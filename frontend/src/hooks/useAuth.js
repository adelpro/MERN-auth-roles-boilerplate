import { useRecoilValue } from "recoil";
import { AccessToken } from "../recoil/atom";
import jwtDecode from "jwt-decode";
const useAuth = () => {
  const accessToken = useRecoilValue(AccessToken);
  let isAdmin = false;
  let isManager = false;
  let status = "Employee";
  if (accessToken) {
    const decode = jwtDecode(accessToken);
    const { username, roles } = decode.UserInfo;
    isAdmin = roles.includes("Admin");
    isManager = roles.includes("Manager");
    if (isManager) status = "Manager";
    if (isAdmin) status = "Admin";
    return { username, roles, status, isAdmin, isManager };
  }
  return { username: "", roles: [], status, isAdmin, isManager };
};
export default useAuth;
