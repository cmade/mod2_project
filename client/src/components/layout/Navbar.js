//Bring in react
import React, { Fragment } from 'react';

//Bring in link fromm the react router dom to link components
import { Link } from 'react-router-dom';

//Bring in connect from redux
import { connect } from 'react-redux';

//Bring in proptypes
import PropTypes from 'prop-types';

//Bring in the logout action
import { logout } from '../../actions/auth';

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const authLinks = (
    <ul>
      <li>
        <Link to='/profiles'>
          <i className='fas fa-user'></i>
          <span className='hide-sm'> Engineers</span>
        </Link>
      </li>
      <li>
        <Link to='/dashboard'>
          <i className='fas fa-user'></i>
          <span className='hide-sm'> Dashboard</span>
        </Link>
      </li>
      <li>
        <a onClick={logout} href='#!'>
          <i className='fas fa-sign-out-alt'></i>
          <span className='hide-sm'> Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to='/profiles'>
          <i className='fas fa-user'></i>
          <span className='hide-sm'> Engineers</span>
        </Link>
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );
  return (
    <nav className='navbar blue-color'>
      <h1>
        <Link to='/'>
          <i className='far fa-grin-alt'></i> Code Club House
        </Link>
      </h1>
      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
