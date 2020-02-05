import axios from 'axios';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOG_OUT,
    CLEAR_PROFILE
} from './types';

import setAuthToken from '../utils/setAuthToken';

import { setAlert }from './alert';


//LOAD USER
export const loaduser = () => async dispatch => {
    if(localStorage.token){
        console.log("load user: " + localStorage.token);
        setAuthToken(localStorage.token);
    }

    try {
        const res = await axios.get('/api/auth');

        console.log(JSON.stringify("DATA FROM /api/auth: " + JSON.stringify(res.data)));
        
        dispatch({
            type:USER_LOADED,
            payload:res.data
        });

    } catch (error) {

        console.log("loadUser ERROR: " + error);

        // const errors =error.response.data.errors;

        // if(errors){
        //     console.log("LOAD_USER_ERROR " + errors);
        //     errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        // }

        dispatch({
            type:AUTH_ERROR
        });
    }
};

//REGISTER USRE
export const register = ({name, email, password}) => async dispatch => {
    const config = {
        headers:{
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({name, email,password});

    try {
        const res = await axios.post('/api/users', body, config);

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })

        dispatch(loaduser());

    } catch (err) {


        console.log("REGISTER_ERROR: " + err);

        const errors =err.response.data.errors;

        if(errors){
            console.log("REGISTER_ERROR " + err);
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            
            type: REGISTER_FAIL
        })
    }
}



//LOGIN USEER
export const login = (email, password) => async dispatch => {


    console.log('email' + email);
    const config = {
        headers:{
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({email,password});


    console.log("DATA TO SEND TO auth/login " + body);

    try {
        const res = await axios.post('/api/auth', body, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        })

        dispatch(loaduser());

    } catch (err) {


        //SHOULD FIX
        dispatch(setAlert("Invalid Credential", 'danger'));
        console.log("ERROR LOGIN " + err);

        // const errors = err.response.data.errors;

        // if(errors){
        //     console.log("LOGIN err " + err);
        //     errors.forEach(error => dispatch(setAlert("ГРЕШКА", 'danger')));
        // }

        dispatch({       
            type: LOGIN_FAIL
        })
    }
}


//LOG OUT 
export const logout = () => dispatch => {
    dispatch({type: CLEAR_PROFILE});
    dispatch({type: LOG_OUT});
    
}