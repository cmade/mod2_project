import React from 'react';
import { Link } from 'react-router-dom';

//Add buttons to the dashboard
const DashboardActions = () => {
  return (
    <div className='dash-buttons'>
      <Link to='/edit-profile' className='btn btn-light'>
        <i className='fas fa-user-circle text-primary' /> Edit Profile
      </Link>
      <br></br>
      <br></br>
      <Link to='/add-experience' className='btn btn-light'>
        <i className='fab fa-black-tie text-primary' /> Add Experience
      </Link>
      <br></br>
      <br></br>
      <Link to='/add-education' className='btn btn-light'>
        <i className='fas fa-graduation-cap text-primary' /> Add Education
      </Link>
    </div>
  );
};

export default DashboardActions;
