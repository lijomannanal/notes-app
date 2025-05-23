import { Outlet, Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const PublicRoutes = () => {
  const { user } = useAuthContext();

  if (user) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};
export default PublicRoutes;
