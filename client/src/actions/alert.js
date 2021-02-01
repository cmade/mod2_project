//Bring in set alert and remove alert so we can dispatch these and call the case we put in the reducer
import { SET_ALERT, REMOVE_ALERT } from './types';

//Bring in uuid for universal id
import { v4 as uuidv4 } from 'uuid';

//Export alerts and dispatch
export const setAlert = (msg, alertType, timeout = 5000) => (dispatch) => {
  //Assign a random id using uuid
  const id = uuidv4();

  //Call set allert from our reducer
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });
  //Set atimer to remove the alert
  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
