//BRing in react
import React from 'react';

//Bring in proptypes
import PropTypes from 'prop-types';

//Anytime you want to interact with the component with redux, whether your calling an action or your getting the state you want to use connect
import { connect } from 'react-redux';
const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

//Get the alert state by fetching it into this component
const mapStateToProps = (state) => ({
  alerts: state.alert,
});

//Remember to export the connect and the component
export default connect(mapStateToProps)(Alert);
