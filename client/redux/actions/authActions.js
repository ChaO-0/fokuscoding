import * as actions from './types';
import axios from 'axios';

export const userRegisterRequest = () => ({
	type: actions.USER_REGISTER_REQUEST,
});

export const userRegisterSuccess = (user) => ({
	type: actions.USER_REGISTER_SUCCESS,
	payload: user,
});

export const userRegisterFail = (error) => ({
	type: actions.USER_REGISTER_FAIL,
	payload: error,
});

export const fetchUserRegister = (data) => (dispatch) => {
	const { email, username, password } = data;
	dispatch(userRegisterRequest());
	setTimeout(async () => {
		try {
			const res = await axios.post('/api/users/signup', {
				email,
				username,
				password,
			});
			const user = res.data;
			dispatch(userRegisterSuccess(user));
		} catch (err) {
			const error = err.message;
			dispatch(userRegisterFail(error));
		}
	}, 300);
};
