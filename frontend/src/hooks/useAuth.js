import { useRecoilValue } from 'recoil'
import { AccessToken } from '../recoil/atom'
import jwtDecode from 'jwt-decode'
import { useEffect, useState } from 'react'
const useAuth = () => {
  const accessToken = useRecoilValue(AccessToken)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isManager, setIsManager] = useState(false)
  const [status, setStatus] = useState('Employee')
  const [userInfo, setUserInfo] = useState({
    username: '',
    id: null,
    roles: [],
  })
  useEffect(() => {
    if (accessToken) {
      const decode = jwtDecode(accessToken)
      setUserInfo(decode.UserInfo)
      if (decode.UserInfo.roles.includes('Admin')) {
        setIsAdmin(true)
        setStatus('Admin')
      }
      if (decode.UserInfo.roles.includes('Manager')) {
        setIsManager(true)
        setStatus('Manager')
      }
    } else {
    }
  }, [accessToken])
  const { username, roles, id } = userInfo
  return { username, roles, id, status, isAdmin, isManager }
}
export default useAuth
