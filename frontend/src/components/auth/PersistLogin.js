import { useEffect, useRef } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { AccessToken, Persist } from '../../recoil/atom'
import useRefreshAccessToken from '../../hooks/useRefreshAccessToken'

export default function PersistLogin() {
  const [accessToken, setAccessToken] = useRecoilState(AccessToken)
  const persist = useRecoilValue(Persist)
  const getNewToken = useRefreshAccessToken()
  const location = useLocation()
  const navigate = useNavigate()
  const effectRan = useRef()
  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      // React 18 Strict Mode
      const verifyRefreshToken = async () => {
        const newAccessToken = await getNewToken()
        setAccessToken(newAccessToken)
      }
      if (!accessToken && persist) {
        verifyRefreshToken()
      } else if (!accessToken) {
        navigate(location.state?.from?.pathname || '/', {
          replace: true,
        })
      }
    }
    return () => (effectRan.current = true)
  }, [accessToken, getNewToken, location, navigate, persist, setAccessToken])
  return <Outlet />
}
