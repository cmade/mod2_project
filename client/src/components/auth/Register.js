//Import react and the ghost element Fragment. We are using a functional component se we also need to bring in the use state hooks
import React, { Fragment, useState } from 'react';

//Bring in link
import { Link, Redirect } from 'react-router-dom';

//Connect to redux by bringin in connect from redux
import { connect } from 'react-redux';

//Bring in the set alert action
import { setAlert } from '../../actions/alert';

//Bring in the register from the auth file
import { register } from '../../actions/auth';

//Bring in proptypes
import PropTypes from 'prop-types';

//Each input needs to have its own state, they also need to have an OnChange handler so when we type in the input it updates the state
const Register = ({ setAlert, register, isAuthenticated }) => {
  //Our state is going to be form data with all the field values. Our second parameter is the function we will call to update the state.
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  //Destructer
  const { name, email, password, password2 } = formData;

  //The setFormData function is assigned to the onchange event handler to update the state. Use the spread operator to get the form date and the e.target.name and e.target.value to update the name and value
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  //On subit function
  const onSubmit = (e) => {
    e.preventDefault();
    //Check to see if the passwords match
    if (password !== password2) {
      //This will be passed into our setAlert actions
      setAlert('Passwords do not match', 'danger');
    } else {
      //This will take the form data for the name, email, and passord and pass it into the register action
      register({ name, email, password });
    }
  };

  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Create Your Account
      </p>
      <form className='form' onSubmit={onSubmit}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={onChange}
            required
          />
          <small className='form-text'>
            This site uses Gravatar, so if you want a profile image, use a
            Gravatar email
          </small>
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
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            value={password2}
            onChange={onChange}
            minLength='6'
          />
        </div>
        <input type='submit' value='Register' className='btn btn-primary' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </Fragment>
  );
};

//Set the register proptypes to an alert object and the register
Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

//Bring in the authenticated state
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

//Whenever we use connect we have to export it alongside the component. You also want to pass your actions through the connect. The first parameter is any state you want to map and the second parameter is an object with any actions you want to use.
export default connect(mapStateToProps, { setAlert, register })(Register);
