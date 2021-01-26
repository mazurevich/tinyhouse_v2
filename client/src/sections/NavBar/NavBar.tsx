import React from "react";

export const NavBar = () => {
  return (
    <nav>
      <div className="nav-wrapper purple darken-2">
        <a href="#" className="brand-logo">
          Logo
        </a>
        <ul id="nav-mobile" className="right">
          <li>
            <a href="sass.html">Sass</a>
          </li>
          <li>
            <a href="badges.html">Components</a>
          </li>
          <li>
            <a href="collapsible.html">JavaScript</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};
