import {
	USER_LOGIN_FAIL,
	USER_LOGIN_REQUEST,
	USER_LOGIN_SUCCESS,
} from '../actions/types';
import { HYDRATE } from 'next-redux-wrapper';

const initState = {
	user: {},
	error: '',
	loading: false,
};

const authReducer = (state = initState, action) => {
	switch (action.type) {
		case HYDRATE:
			return {
				...state,
				...action.payload,
			};
		case USER_LOGIN_REQUEST:
			return {
				...state,
				loading: true,
			};
		case USER_LOGIN_SUCCESS:
			return {
				...state,
				user: action.payload,
				loading: false,
			};
		case USER_LOGIN_FAIL:
			return {
				...state,
				loading: false,
				error: action.payload,
			};
		default:
			return state;
	}
};

export default authReducer;
