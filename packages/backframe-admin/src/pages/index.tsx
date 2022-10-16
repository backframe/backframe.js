import { Navigate } from "react-router-dom";

export function Index() {
  const loggedIn: "true" | "false" = "false";

  if (loggedIn === "true") {
    return <Navigate to="/auth/login" />;
  } else {
    return <Navigate to="/app/metrics" />;
  }
}
