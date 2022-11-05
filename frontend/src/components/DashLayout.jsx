<<<<<<< HEAD:frontend/src/components/DashLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import DashLayoutFooter from "./DashLayoutFooter";
import DashLayoutHeader from "./DashLayoutHeader";
=======
import { Outlet } from 'react-router-dom'
import DashLayoutFooter from './DashLayoutFooter'
import DashLayoutHeader from './DashLayoutHeader'
>>>>>>> v4.0.6:frontend/src/components/DashLayout.js

export default function DashLayout() {
    return (
        <>
            <div
                style={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                }}
            >
                <DashLayoutHeader />
                <h1>Dash</h1>
                <Outlet />
            </div>
            <DashLayoutFooter />
        </>
    )
}
