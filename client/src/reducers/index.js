//Bring in reducer
import { combineReducers } from 'redux';

//Bring in auth
import auth from './auth';

//Bring in the alert reducer
import alert from './alert';

//Bring in the profile reducer
import profile from './profile';

//Export the combined reducers
export default combineReducers({
  alert,
  auth,
  profile,
});
