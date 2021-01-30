import React from 'react';
//Bring in link fromm the react router dom to link components
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className='navbar blue-color'>
      <h1>
        <Link to='/'>
          <i className='far fa-grin-alt'></i> Code Club House
        </Link>
      </h1>
      <ul>
        <li>
          <a href='!#'>Engineers</a>
        </li>
        <li>
          <Link to='/register'>Register</Link>
        </li>
        <li>
          <Link to='/login'>Login</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
