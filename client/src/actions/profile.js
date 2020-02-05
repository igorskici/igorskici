import axios from 'axios';
import {setAlert} from './alert';
import {
    GET_PROFILE,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    CLEAR_PROFILE,
    DELETE_ACCOUNT,
    GET_PROFILES,
    GET_REPOS
} from './types';

//GET current profile
export const getCurrentProfile = () => async dispatch => {
    try {   
        const res = await axios.get('/api/profile/me');
        console.log("call profile/me response" + JSON.stringify(res));

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

    } catch (err) {

        console.log("ERROR WHILE GETTING PROFILE" + err)

        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: "Profile allready exist", status: err.response.status}
        })
    }
}

//GET ALL PROFILES
export const getProfiles = () => async dispatch => {

  dispatch({type: CLEAR_PROFILE});

  try {   
      const res = await axios.get('/api/profile');
      console.log("call profile/me response" + JSON.stringify(res));

      dispatch({
          type: GET_PROFILES,
          payload: res.data
      });


  } catch (err) {

      console.log("ERROR WHILE GETTING PROFILE" + err)

      dispatch({
          type: PROFILE_ERROR,
          payload: {msg: "Profile allready exist", status: err.response.status}
      })
  }
}

//GET PROFILE BY ID
export const getProfilesById = userId => async dispatch => {

  try {   
      const res = await axios.get(`/api/profile/user/${userId}`);
      console.log("call profileByID response" + JSON.stringify(res));

      dispatch({
          type: GET_PROFILE,
          payload: res.data
      });


  } catch (err) {

      console.log("ERROR WHILE GETTING PROFILE" + err)

      dispatch({
          type: PROFILE_ERROR,
          payload: {msg: "Profile allready exist", status: err.response.status}
      })
  }
}



//GET PROFILE BY ID
export const getGitHubRepos = username => async dispatch => {

  try {   
      const res = await axios.get(`/api/profile/github/${username}`);
      console.log("call profile/me response" + JSON.stringify(res));

      dispatch({
          type: GET_REPOS,
          payload: res.data
      });


  } catch (err) {

      console.log("ERROR WHILE GETTING PROFILE" + err)

      dispatch({
          type: PROFILE_ERROR,
          payload: {msg: "Profile allready exist", status: err.response.status}
      })
  }
}


//Create profile
export const createProfile = (formData, history, edit=false) => async dispatch => {
    try {

        const config = {
            headers:{
                'Content-Type': 'application/json'
            }
        }

        console.log("call create-profile");
        const res = await axios.post('/api/profile', formData, config);

        
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

        dispatch(setAlert(edit ? 'profile updated' : 'profile created', 'success'));

        if(!edit){
            history.push('/dashboard');
        }

    } catch (err) {

        const errors =err.response.data.errors;

        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        console.log(err)

        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: "Profile allready exist", status: err.response.status}
        });

    }
}


//Add education
export const addEducation = (formData, history) => async dispatch => {
    try {

        const config = {
            headers:{
                'Content-Type': 'application/json'
            }
        }

        console.log("call create-profile");
        const res = await axios.put('/api/profile/education', formData, config);
        
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

         dispatch(setAlert('Education added', 'success'));

      
        history.push('/dashboard');
      

    } catch (err) {

        const errors =err.response.data.errors;

        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        console.log(err)

        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: "Profile allready exist", status: err.response.status}
        });

        
    }
}



//Add expiriance
export const addExperiences = (formData, history) => async dispatch => {
    try {

        const config = {
            headers:{
                'Content-Type': 'application/json'
            }
        }

        console.log("call create-profile");
        const res = await axios.put('/api/profile/expiriance', formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Experiance added', 'success'));

      
            history.push('/dashboard');
      

    } catch (err) {

        const errors =err.response.data.errors;

        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        console.log(err)

        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: "Profile allready exist", status: err.response.status}
        });

        
    }
}

//Delete experiance

export const deleteExperiance = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/expiriance/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Experiance removed', 'success'));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: "Profile allready exist", status: err.response.status }
    });
  }
};


export const deleteEducation = id => async dispatch => {
    try {
      const res = await axios.delete(`/api/profile/education/${id}`);
  
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
      });
  
      dispatch(setAlert('Education removed', 'success'));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: "Education allready exist", status: err.response.status }
      });
    }
  };


//delete account & profile
  export const deleteAccount = id => async dispatch => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`/api/profile`);

        dispatch({
          type: CLEAR_PROFILE
        });
        dispatch({
            type: DELETE_ACCOUNT
        });

        dispatch(setAlert("Your account has been deleted", "success"));

      } catch (err) {
        dispatch({
          type: PROFILE_ERROR,
          payload: {
            msg: "Cannot be deleted",
            status: err.response.status
          }
        });
      }
    }
  };