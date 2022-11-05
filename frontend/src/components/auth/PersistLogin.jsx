<<<<<<< HEAD:frontend/src/components/auth/PersistLogin.jsx
import React, { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Navigate, Outlet, useLocation } from "react-router-dom";
=======
import { useEffect, useRef } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
>>>>>>> v4.0.6:frontend/src/components/auth/PersistLogin.js

import { AccessToken, Persist } from '../../recoil/atom'
import useRefreshAccessToken from '../../hooks/useRefreshAccessToken'

export default function PersistLogin() {
<<<<<<< HEAD:frontend/src/components/auth/PersistLogin.jsx
  const [accessToken, setAccessToken] = useRecoilState(AccessToken);
  const persist = useRecoilValue(Persist);
  const getNewToken = useRefreshAccessToken();
  const location = useLocation();
  const effectRan = useRef();
  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      // React 18 Strict Mode
      const verifyRefreshToken = async () => {
        const newAccessToken = await getNewToken();
        setAccessToken(newAccessToken);
      };
      if (!accessToken && persist) {
        verifyRefreshToken();
      } else if (!accessToken) {
        <Navigate to="/" state={{ from: location }} replace />;
      }
    }
    effectRan.current = true;
  }, [accessToken, getNewToken, location, persist, setAccessToken]);
  return <Outlet />;
=======
    const [accessToken, setAccessToken] = useRecoilState(AccessToken)
    const persist = useRecoilValue(Persist)
    const getNewToken = useRefreshAccessToken()
    const location = useLocation()
    const effectRan = useRef()
    useEffect(() => {
        if (
            effectRan.current === true ||
            process.env.NODE_ENV !== 'development'
        ) {
            // React 18 Strict Mode
            const verifyRefreshToken = async () => {
                const newAccessToken = await getNewToken()
                setAccessToken(newAccessToken)
            }
            if (!accessToken && persist) {
                verifyRefreshToken()
            } else if (!accessToken) {
                ;<Navigate to="/" state={{ from: location }} replace />
            }
        }
        return () => (effectRan.current = true)
    }, [accessToken, getNewToken, location, persist, setAccessToken])
    return <Outlet />
>>>>>>> v4.0.6:frontend/src/components/auth/PersistLogin.js
}
