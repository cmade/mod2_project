//Bring in axios to fetch data
import axios from 'axios';

//Bring in types
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
} from './types';

//Bring in auth token
import setAuthToken from '../utils/setAuthToken';

//Bring in the set alert action
import { setAlert } from './alert';

//Load user
export const loadUser = () => async (dispatch) => {
  //Check to see if there is a token in localstorage
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  //Then make your request
  try {
    const res = await axios.get('/api/auth');
    dispatch({ type: USER_LOADED, payload: res.data });
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
  }
};

//Register user. Pass the name, email and password through the dispatch
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  //Prepare the data to send
  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post('/api/users', body, config);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    //Access errors
    const errors = err.response.data.errors;

    //Check for errors
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

//Login user. Pass the name, email and password through the dispatch
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  //Prepare the data to send
  const body = JSON.stringify({ email, password });

  try {
    //Make a post request to api/auth
    const res = await axios.post('/api/auth', body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    //Access errors
    const errors = err.response.data.errors;

    //Check for errors
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

//Logout, and clear the profile
export const logout = () => (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};
