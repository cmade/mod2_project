//Bring in a fragment, it is a ghost element it wont show up in the dom
import React, { Fragment } from 'react';

//Import react router
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//Import components
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Footer from './components/layout/Footer';

import './App.css';

//Arrow function so we can use react hooks
const App = () => (
  //In order for the router ter work we need to wrap it around the components
  <Router>
    <Fragment>
      <Navbar />
      <Footer />
      <Route exact path='/' component={Landing} />
      <section className='container'>
        <Switch>
          <Route exact path='/register' component={Register} />
          <Route exact path='/login' component={Login} />
        </Switch>
      </section>
    </Fragment>
  </Router>
);

export default App;
