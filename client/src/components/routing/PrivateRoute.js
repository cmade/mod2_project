//Bring in react
import React, { Component } from 'react';

//Brin in the route and redirect
import { Route, Redirect } from 'react-router-dom';

//Bring in proptypes
import PropTypes from 'prop-types';

//Bring in the auth state
import { connect } from 'react-redux';

//Bring in the connect
import moduleName from 'react-redux';
//Pass components through the private route, and the rest spread operator will bring in any other parameters that are passed in
const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      !isAuthenticated && !loading ? (
        <Redirect to='/login' />
      ) : (
        <Component {...props} />
      )
    }
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
