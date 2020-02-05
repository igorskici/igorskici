import React, {Fragment, useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import Navbar from '../src/components/Layout/Navbar';
import Landing from '../src/components/Layout/Landing';
import Login from '../src/components/auth/Login';
import Register from '../src/components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-form/CreateProfile';
import EditProfile from './components/profile-form/EditProfile';
import AddExperience from './components/profile-form/AddExperience';

import Profile from './components/profile/Profile';

import Profiles from './components/profiles/Profiles';


import PrivateRoute from './components/routing/PrivateRoute';
//redux
import {Provider} from 'react-redux';
import store from './store'; 


import Alert from './components/Layout/Alert';
import {loaduser} from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import AddEducation from './components/profile-form/AddEducation';

if(localStorage.token){
  setAuthToken(localStorage.token);
} 

const App = () => { 
  
  useEffect(() => {
    console.log("USEEFECT LOAD");
    store.dispatch(loaduser());
  },[]);
  
  return (
  <Provider store={store}>
  <Router>
  <Fragment>
    <Navbar />
    <Route exact path='/' component={Landing} />
     <section className="container">
       <Alert />
        <Switch>
          <Route exact path='/login' component={Login} />
          <PrivateRoute exact path='/profiles' component={Profiles} />
          <PrivateRoute exact path='/profile/:id' component={Profile} />
          <Route exact path='/register' component={Register} />
          <PrivateRoute exact path='/dashboard' component={Dashboard} />
          <PrivateRoute exact path='/create-profile' component={CreateProfile} />
          <PrivateRoute exact path='/edit-profile' component={EditProfile} />
          <PrivateRoute exact path='/add-experience' component={AddExperience} />
          <PrivateRoute exact path='/add-education' component={AddEducation} />
        </Switch>
     </section>
  </Fragment>
  </Router>
  </Provider>
)};

export default App;
