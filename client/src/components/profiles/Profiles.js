import React,{Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'; 
import Spinner from '../Layout/Spinner';
import {getProfiles} from '../../actions/profile'; 

import Profileitem from './Profileitem';

const Profiles = ({getProfiles, profile:{profiles, loading}}) => {

    useEffect(() => {
        getProfiles();
    },[getProfiles]);

    return <Fragment>
        {loading ? <Spinner /> : <Fragment>
                <h1 className="large text-primary">Developers</h1>
                <p className="lead">
                    <i className="fab fa-connectdevelop"></i> Browse and connect with Developers
                </p>
                <div className="profiles">
                    {profiles.length > 0 ? (
                        profiles.map(profile => (
                            <Profileitem key={profile.id} profile={profile}/>
                        ))
                    ) : <h4>No profiles found</h4>}
                </div>
        </Fragment> }
    </Fragment>
}

Profiles.propTypes = {
    getProfiles:PropTypes.func.isRequired,
    prfile:PropTypes.object.isRequired
}
const mapStateToProps = state => ({
    profile:state.profile
})

export default connect(mapStateToProps, {getProfiles})(Profiles)
