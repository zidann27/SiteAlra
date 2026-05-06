import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { fetchSessionUser, isAuthenticated } from "../../lib/auth";

export default function ProtectedRoute() {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(isAuthenticated());

  useEffect(() => {
    if (authed) {
      setChecking(false);
      return;
    }

    fetchSessionUser()
      .then((user) => {
        setAuthed(Boolean(user));
      })
      .finally(() => {
        setChecking(false);
      });
  }, [authed]);

  if (checking) {
    return null;
  }

  if (!authed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
