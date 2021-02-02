//Bring in the variables from types
import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initialState = [];
//This is a function that takes in state and an action. An action is going to be dispatched to an reducer file. Below we start with the initial state
//It will export the function that takes in the state and an action
//Depending on the type we need to decide what will be send down as the state
//We dispatch the type set alert
//The remove alert is filtering through to remove and return all alerts except for the one that matches the payload
function alertReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      return [...state, payload];
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload);
    default:
      return state;
  }
}

export default alertReducer;
