//Bring in store and middleware from Redux
import { createStore, applyMiddleware } from 'redux';

// Bring in compose from dev tools
import { composeWithDevTools } from 'redux-devtools-extension';

//Bring in thunk for middleware
import thunk from 'redux-thunk';

//Bring in the reducer
import rootReducer from './reducers';

//Create state
const initialState = {};

//Assign thunk to middleware variable
const middleware = [thunk];

//Create the store
const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

//Eport the store
export default store;
