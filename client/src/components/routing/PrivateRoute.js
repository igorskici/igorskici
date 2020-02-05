import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

const PrivateRoute = ({
  component: Component,
  auth: { isAuthenicated, loading },
  ...rest
}) => (

  <Route
    {...rest}
    render={props =>
      !isAuthenicated && !loading ? (
        
        <Redirect to="/login" />
      ) : (
        <Component {...props} />
      )
    }
  />
);


PrivateRoute.propTypes = {
auth: PropTypes.object.isRequired
}

const mapStateToPropes = state => ({
    auth: state.auth
})

export default connect(mapStateToPropes)(PrivateRoute)
