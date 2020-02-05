import React from 'react'
import { Link , Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'; 

const Landing = ({isAuthenicated}) => {

  if(isAuthenicated) {
    return <Redirect to="/dashboard" />
  }

  return (
    <section className="landing">
    <div className="dark-overlay">
      <div className="landing-inner">
        <h1 className="x-large">Telekom Developer Connector</h1>
        <p className="lead">
          Create a developer profile/portfolio, share posts and get help from
          other developers
        </p>
        <div className="buttons">
          <Link to="/register" className="btn btn-primary">Sign Up</Link>
          <Link to="/login" className="btn btn-light">Login</Link>
        </div>
      </div>
    </div>
  </section>
  )
}

Landing.propTypes = {
  isAuthenicated:PropTypes.bool
}

const mapStateToProps = state => ({
  isAuthenicated: state.auth.isAuthenicated
})

export default connect(mapStateToProps)(Landing)
