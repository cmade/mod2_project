//Bring in React and useEffect
import React, { Fragment, useEffect } from 'react';

//Bring in prototypes
import PropTypes from 'prop-types';

//Bring in connect from redux
import { connect } from 'react-redux';

//Bring in profile and delete action
import { getCurrentProfile, deleteAccount } from '../../actions/profile';

//Bring in the spinner
import Spinner from '../layout/Spinner';

//Bring in link
import { Link } from 'react-router-dom';

//Bring in dashboard action buttons
import DashboardActions from './DashboardActions';

//Bring in the experience component
import Experience from './Experience';

//Bring in the education component
import Education from './Education';

const Dashboard = ({
  getCurrentProfile,
  deleteAccount,
  auth: { user },
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);
  console.log(profile);
  //if the profile and loading havent loaded yet, show the spinner
  return profile && loading == null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 class='large text-primary'>Dashboard</h1>
      <p class='lead'>
        <i class='fas fa-user'></i> Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <Fragment>
          <DashboardActions />
          <Experience experience={profile.experience} />
          <Education education={profile.education} />
          <div className='my-2'>
            <button className='btn btn-danger' onClick={() => deleteAccount()}>
              <i className='fas fa-user-minus' /> Delete My Account
            </button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <p>You have not setup a profile, please add some info.</p>{' '}
          <Link to='/create-profile' className='btn btn-primary my'>
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
  Dashboard
);
