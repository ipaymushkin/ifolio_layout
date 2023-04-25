import React from "react";
import {NavBar, NavBarMobile} from "ifolio_navbars";

const NavbarStatic = ({config}) => {
  return (
    <>
      <NavBar isStatic={true} config={config} />
      <NavBarMobile config={config} isStatic={true} />
    </>
  );
};

export default NavbarStatic;
