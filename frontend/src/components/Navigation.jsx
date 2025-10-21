import { NavLink } from "react-router";
import classes from "./Navigation.module.css";

export default function Navigation() {
  return (
    <>
      <nav className={classes.navigation}>
        <div className={classes["nav-header"]}>
          <h2>Menu</h2>
        </div>
        <ul className={classes["nav-list"]}>
          <NavLink to="/" className={({ isActive }) => isActive ? classes.active : undefined} end>
            Home
          </NavLink>
          <NavLink to="/customers" className={({ isActive }) =>isActive ? classes.active : undefined}>
            Customers
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) =>isActive ? classes.active : undefined}>
            Analytics
          </NavLink>
        </ul>
      </nav>
    </>
  );
}
