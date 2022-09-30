import React from "react";
import ReactDOM from "react-dom";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/auth/Login";
import DashLayout from "./components/DashLayout";
import PageNotFound from "./components/PageNotFound";
import Welcome from "./components/auth/Welcome";
import NotesList from "./components/notes/NotesList";
import UsersList from "./components/users/UsersList";
import NewUserFrom from "./components/users/NewUserFrom";
import PersistLogin from "./components/auth/PersistLogin";
function App() {
  return (
    <Routes>
      {/* Public routes*/}
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      {/* TODO add roles privileges*/}
      {/* Private routes */}
      <Route element={<PersistLogin />}>
        <Route path="dash" element={<DashLayout />}>
          <Route index element={<Welcome />} />
          <Route path="notes">
            <Route index element={<NotesList />} />
          </Route>
          <Route path="users">
            <Route index element={<UsersList />} />
            <Route path="signin" element={<NewUserFrom />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
