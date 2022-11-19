import { useRecoilValue } from 'recoil';
import jwtDecode from 'jwt-decode';
import { AccessToken } from '../recoil/atom';

const useAuth = () => {
  const accessToken = useRecoilValue(AccessToken);
  let isAdmin = false;
  let isManager = false;
  let status = 'Employee';
  const defaultImage = `${process.env.REACT_APP_BASEURL}/images/default.png`;

  if (accessToken) {
    const decode = jwtDecode(accessToken);
    const { username, id, roles, profileImage } = decode.UserInfo;
    const loadProfileImage =
      profileImage?.length !== 0 ? `${process.env.REACT_APP_BASEURL + profileImage}` : defaultImage;
    isAdmin = roles.includes('Admin');
    isManager = roles.includes('Manager');
    if (isManager) status = 'Manager';
    if (isAdmin) status = 'Admin';
    return {
      username,
      roles,
      id,
      status,
      isAdmin,
      profileImage: loadProfileImage
    };
  }
  return {
    username: '',
    id: null,
    roles: [],
    status,
    isAdmin,
    isManager,
    profileImage: defaultImage
  };
};
export default useAuth;
