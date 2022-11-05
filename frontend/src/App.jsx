import React from "react"
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
import ProtectedRoutes from "./components/ProtectedRoutes";
import ROLES from "./config/roles";
import EditUserForm from "./components/users/EditUserForm";
import NewNoteForm from "./components/notes/NewNoteForm";
import EditNoteForm from "./components/notes/EditNoteForm";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      {/* TODO add roles privileges */}
      {/* Private routes */}
      <Route element={<PersistLogin />}>
        <Route path="dash" element={<DashLayout />}>
          <Route index element={<Welcome />} />
          <Route path="notes">
            <Route index element={<NotesList />} />
            <Route path="addnote" element={<NewNoteForm />} />
            <Route path=":id" element={<EditNoteForm />} />
          </Route>
          <Route
            element={
              <ProtectedRoutes
                allowedRoles={[ROLES[2].value, ROLES[1].value]}
              />
            }
          >
            <Route path="users">
              <Route index element={<UsersList />} />
              <Route
                element={<ProtectedRoutes allowedRoles={[ROLES[2].value]} />}
              >
                <Route path="signin" element={<NewUserFrom />} />
                <Route path=":id" element={<EditUserForm />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
