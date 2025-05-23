import { Outlet, Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import Header from "../components/Header";
import { useLayoutContext } from "../context/LayoutContext";
// import Sidebar from "../components/Sidebar";

const PrivateRoutes = () => {
  const { user } = useAuthContext();
  const { theme } = useLayoutContext();

  if (!user) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <>
        <Header />
        <div className={`main-layout ${theme}`}>
          <div className="row">
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-5 mt-3">
              <Outlet />
            </main>
          </div>
        </div>
      </>
    </>
  );
};
export default PrivateRoutes;
