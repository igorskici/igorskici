import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOG_OUT,
    DELETE_ACCOUNT
} from '../actions/types';

const initialState = {
    token:localStorage.getItem('token'),
    isAuthenicated:null,
    loading: true,
    user:null
}

export default function(state = initialState, action){

const {type, payload} = action; 


console.log("TYPE ACTION: " + type);

    switch(type){

        
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem('token', payload.token);
            return{
                ...state,
                ...payload,
                isAuthenicated:true,
                loading:false
            }
        case REGISTER_FAIL:
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOG_OUT:
        case DELETE_ACCOUNT:
            localStorage.removeItem('token');
            return{
                ...state,
                token:null,
                isAuthenicated:false,
                loading:false
            }
        case USER_LOADED:
                return{
                    ...state,
                    isAuthenicated:true,
                    loading:false,
                    user: payload
                };

            default:
                return state;
    }

}