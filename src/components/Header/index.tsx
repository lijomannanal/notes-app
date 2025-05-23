import { useNavigate } from "react-router-dom";
// import Jdenticon from './Jdenticon';
// import useAuth from '../hooks/useAuth';

// import { logout } from '../services/MockAuthService';

import "./style.css";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useAuthContext } from "../../context/AuthContext";
import { useLayoutContext } from "../../context/LayoutContext";
import { Sun, Moon } from "react-bootstrap-icons";

function Header() {
  const navigate = useNavigate();
  const { logout, user } = useAuthContext();
  const { theme, toggleTheme } = useLayoutContext();
  //   const user = auth.getSession();

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logout();
    navigate("/");
  };

  return (
    <Navbar className="custom-navbar" variant="dark" bg="primary">
      <Container fluid className="custom-nav">
        <Navbar.Brand>Notes App</Navbar.Brand>
        <Nav.Item>
          <Nav.Link onClick={toggleTheme}>
            {theme === "light" ? <Moon /> : <Sun />}
          </Nav.Link>
        </Nav.Item>
        <Navbar.Collapse id="navbar-dark-example">
          <Navbar.Collapse className="justify-content-end">
            <Nav className="ml-auto">
              <NavDropdown
                align={`start`}
                id="nav-dropdown-dark-example"
                title={user?.name}
                menuVariant="light"
              >
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
