//Bring in a fragment, it is a ghost element it wont show up in the dom, and the lifecycle method useEffect
import React, { Fragment, useEffect } from 'react';

//Bring in react router
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//Bring in components
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Footer from './components/layout/Footer';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';

//Bring in the user and the token
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

//Redux
import { Provider, provider } from 'react-redux';
import store from './store';

//Import css file
import './App.css';

//Check local storage for user token
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

//Arrow function so we can use react hooks
const App = () => {
  //The useeffect will run once and dispatch the loaded user to the redux store
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    //In order for the router to work we need to wrap it around the components
    //Pass in the store
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Footer />
          <Route exact path='/' component={Landing} />
          <section className='container'>
            <Alert />
            <Switch>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
              <PrivateRoute exact path='/dashboard' component={Dashboard} />
              <PrivateRoute
                exact
                path='/create-profile'
                component={CreateProfile}
              />
              <PrivateRoute
                exact
                path='/edit-profile'
                component={EditProfile}
              />
              <PrivateRoute
                exact
                path='/add-experience'
                component={AddExperience}
              />
              <PrivateRoute
                exact
                path='/add-education'
                component={AddEducation}
              />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
