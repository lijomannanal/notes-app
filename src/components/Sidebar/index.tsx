import { NavLink } from "react-router-dom";

import "./style.css";

function Sidebar() {
  const items = [{ path: "/", title: "Home", icon: "bi-house-door" }];

  return (
    <>
      <div className="position-sticky pt-3">
        <ul className="nav flex-column">
          {items.map((item, i) => (
            <li key={i} className="nav-item">
              <NavLink className="nav-link" end to={item.path}>
                <i className={`bi ${item.icon} pe-2`} />
                {item.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
