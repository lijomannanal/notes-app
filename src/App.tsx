import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import LoginForm from "./components/LoginForm";
// import Home from "./components/Home";
import PrivateRoutes from "./utils/PrivateRoutes";
import PublicRoutes from "./utils/PublicRoutes";
import { AuthProvider } from "./context/AuthContext";
import Home from "./components/Home";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { NotesProvider } from "./context/NotesContext";
import "./App.css";
import { SocketProvider } from "./context/SocketContext";
import { LayoutProvider } from "./context/LayoutContext";

const App = () => {
  return (
    <Router>
      <LayoutProvider>
        <AuthProvider>
          {" "}
          <Routes>
            <Route element={<PrivateRoutes />}>
              {" "}
              <Route
                path="/"
                element={
                  <SocketProvider>
                    <NotesProvider>
                      <Home />
                    </NotesProvider>
                  </SocketProvider>
                }
              />
            </Route>
            <Route element={<PublicRoutes />}>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
            </Route>
          </Routes>
        </AuthProvider>
      </LayoutProvider>
    </Router>
  );
};

export default App;
