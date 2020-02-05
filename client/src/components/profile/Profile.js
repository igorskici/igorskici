import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Spinner from '../Layout/Spinner';
import {getProfilesById} from '../../actions/profile';
import { Link } from 'react-router-dom';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';

const Profile = ({ getProfilesById, profile: {profile, loading}, auth, match }) => {

    // console.log(JSON.stringify("AUTH FROM STATE" + auth));


    useEffect(() => {
        getProfilesById(match.params.id);
    },[getProfilesById, match.params.id]);

    return <Fragment>
        {profile === null || loading ? <Spinner /> : <Fragment>
            <Link to="/profiles" className="btn btn-light">
                Back To Profiles
            </Link>
            {auth.isAuthenicated && auth.loading === false && auth.user_id === profile.user._id && (
                <Link to="/edit-profile" className="btn btn-dark">
                    Edit Profile
                </Link>
            )}
             <div className="profile-grid my-1">
                 <ProfileTop profile={profile}/>
                 <ProfileAbout profile={profile}/>
             </div>
            </Fragment>}
    </Fragment>
}

Profile.propTypes = {
    getProfilesById: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
}
const MapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth
})

export default connect(MapStateToProps, {getProfilesById})(Profile)
