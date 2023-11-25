
import React from 'react';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
} from './NavbarElements';
import styles from "../Main/styles.module.css"
const handlelogout = () => {
  localStorage.removeItem("token")
   window.location.reload()
}

const Navbar = () => {
  return (
    <>
      <Nav>
        <Bars />
  
        <NavMenu>
        <NavLink to='/dashboard' activeStyle>
            Dashboard
          </NavLink>
          <NavLink to='/home' activeStyle>
            Profile
          </NavLink>
          <NavLink to="/subgreddiit" activeStyle>
            My Subgreddiits
          </NavLink>
          <NavLink to="/allsubgreddiit" activeStyle>
            Subgreddiits
          </NavLink>
          <NavLink to="/savedposts" activeStyle>
            SavedPosts
          </NavLink>
          {/* Second Nav */}
          {/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
        </NavMenu>
        <NavBtn>
          <NavBtnLink to="/" onClick={handlelogout}>Logout</NavBtnLink>
        </NavBtn>
      </Nav>
      <nav className={styles.navbar}>
					<h1>GREDDIIT</h1>
				</nav>
    </>
  );
};
  
export default Navbar;