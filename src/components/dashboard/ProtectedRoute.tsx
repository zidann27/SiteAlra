import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { fetchSessionUser, isAuthenticated } from "../../lib/auth";

export default function ProtectedRoute() {
  const location = useLocation();
  const [authed, setAuthed] = useState(isAuthenticated());
  const [checking, setChecking] = useState(() => !isAuthenticated());

  useEffect(() => {
    setChecking(!isAuthenticated());
    // Always sync with backend cookie session.
    // This prevents stale localStorage (e.g., after switching accounts)
    // and avoids cross-account data leaking in UI (chat, settings, etc).
    fetchSessionUser()
      .then((user) => {
        setAuthed(Boolean(user));
      })
      .finally(() => {
        setChecking(false);
      });
  }, [location.pathname]);

  if (checking && !authed) {
    return null;
  }

  if (!authed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
