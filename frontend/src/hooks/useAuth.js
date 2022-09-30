import { useRecoilValue } from "recoil";
import { Token } from "../recoil/atom";
import { jwtDecode } from "jwt-decoder";
const useAuth = () => {
  const [token] = useRecoilValue(Token);
  let isAdmin = false;
  let isManager = false;
  let status = "Employee";
  if (token) {
    const decode = jwtDecode(token);
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
