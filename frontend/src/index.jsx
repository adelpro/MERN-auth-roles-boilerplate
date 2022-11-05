<<<<<<< HEAD:frontend/src/index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import App from "./App";

if (process.env.NODE_ENV === "production") {
  disableReactDevTools();
=======
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { disableReactDevTools } from '@fvilers/disable-react-devtools'
if (process.env.NODE_ENV === 'production') {
    disableReactDevTools()
>>>>>>> v4.0.6:frontend/src/index.js
}
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <RecoilRoot>
            <BrowserRouter>
                <Routes>
                    <Route path="/*" element={<App />} />
                </Routes>
            </BrowserRouter>
        </RecoilRoot>
    </React.StrictMode>
)
