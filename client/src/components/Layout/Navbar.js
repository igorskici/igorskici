import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import  {logout} from '../../actions/auth';


const NavBar = ({auth: {isAuthenicated, loading} , logout}) => {

  const authLinks = (
    <ul>
          <li>
      <Link to="/profiles">
          Developers
      </Link>
    </li>
    <li>
      <Link to="/dashboard">
      <i className="fas fa-user"></i>{'   '}
      <span className="hide-sm">Dashboard</span>
      </Link>
    </li>
    <li>
      <a onClick={logout} href="#!">
        <i className="fas fa-sign-out-alt"></i>{'   '}
        <span className="hide-sm">Logout</span></a>
    </li>

  </ul>
  );


  const guessLinks = (
    <ul>
          <li>
      <Link to="/profiles">
          Developers
      </Link>
    </li>
    <li>
      <Link to="/register">Register</Link>
    </li>
    <li>
      <Link to="/login">Login</Link>
    </li>
  </ul>
    );

    return (
      <nav className="navbar bg-dark">
        <h1>
          <Link to="/">
            <img src="https://logos-download.com/wp-content/uploads/2016/11/Telekom_logo.png" style={{height: "17px", width:"40px"}}></img>   Telekom DevConnector
          </Link>
        </h1>
    {!loading && <Fragment>{isAuthenicated ? authLinks: guessLinks}</Fragment> }
      </nav>
    );
}

NavBar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth:PropTypes.object.isRequired
}

const mapStateToProps = state => ({
auth:state.auth
})

export default connect(mapStateToProps, {logout})(NavBar)
