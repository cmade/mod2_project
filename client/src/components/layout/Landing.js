import React from 'react';
//Bring in link fromm the react router dom to link components
import { Link, Redirect } from 'react-router-dom';

//Bring in connect to interact with the state
import { connect } from 'react-redux';

//Bring in proptypes
import PropTypes from 'prop-types';

const Landing = ({ isAuthenticated }) => {
  //If logged in redirect user to their dashboard instead of the landing page
  if (isAuthenticated) {
    return <Redirect to='dashboard' />;
  }
  return (
    <section className='landing'>
      <div>
        <div className='landing-inner'>
          <div className='landing-left'>
            <h1 className='x-large'>Code Club House</h1>
            <p className='lead'>
              Network with developers and make new friends!
            </p>
            <div className='buttons'>
              <Link to='/register' className='btn btn-primary'>
                Sign Up
              </Link>
              <Link to='/login' className='btn btn'>
                Login
              </Link>
            </div>
          </div>
          <div className='landingImg two'></div>
        </div>
      </div>
    </section>
  );
};

Landing.protoTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps)(Landing);
