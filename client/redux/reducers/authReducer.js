import {
	USER_REGISTER_FAIL,
	USER_REGISTER_REQUEST,
	USER_REGISTER_SUCCESS,
} from '../actions/types';

const initState = {
	user: {},
	error: '',
	loading: false,
};

const authReducer = (state = initState, action) => {
	switch (action.type) {
		case USER_REGISTER_REQUEST:
			return {
				...state,
				loading: true,
			};
		case USER_REGISTER_SUCCESS:
			return {
				...state,
				user: action.payload,
				loading: false,
			};
		case USER_REGISTER_FAIL:
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
