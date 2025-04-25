import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavLink = ({ to, children, className = '', activeClassName = '' }) => {
  const location = useLocation();
  // Check if the current path starts with the link's path
  const isActive = location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={`${className} ${isActive ? activeClassName : ''}`}
    >
      {children}
    </Link>
  );
};

export default NavLink; 