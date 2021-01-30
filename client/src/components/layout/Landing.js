import React from 'react';
//Bring in link fromm the react router dom to link components
import { Link } from 'react-router-dom';

const Landing = () => {
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
export default Landing;
