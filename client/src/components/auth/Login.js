//Import react and the ghost element Fragment. We are using a functional component se we also need to bring in the use state hooks
import React, { Fragment, useState } from 'react';

//Bring in link
import { Link, Redirect } from 'react-router-dom';

//Bring in connect from Redux
import { connect } from 'react-redux';

//Bring in proptypes
import PropTypes from 'prop-types';

//Bring in login
import { login } from '../../actions/auth';

//Each input needs to have its own state, they also need to have an OnChange handler so when we type in the input it updates the state
const Login = ({ login, isAuthenticated }) => {
  //Our state is going to be form data with all the field values. Our second parameter is the function we will call to update the state.
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  //Destructer
  const { email, password } = formData;

  //The setFormData function is assigned to the onchange event handler to update the state. Use the spread operator to get the form date and the e.target.name and e.target.value to update the name and value
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  //On subit function
  const onSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  //Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Sign In </h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Sign Into Your Account
      </p>
      <form className='form' onSubmit={onSubmit}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            onChange={onChange}
            minLength='6'
          />
        </div>
        <input type='submit' value='Login' className='btn btn-primary' />
      </form>
      <p className='my-1'>
        Don't have an account? <Link to='/register'>Sign Up</Link>
      </p>
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

//Bring in the authenticated state
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, { login })(Login);
