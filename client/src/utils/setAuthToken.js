//Bring in axois
import axios from 'axios';

//Create a function call setAuthToken that passes in a token that will be checked
//if the toke is there set the header to the token, if not delete it
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;
