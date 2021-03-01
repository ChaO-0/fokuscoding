import * as actions from './types';
import axios from 'axios';

const LOGIN_URL = '/api/users/signin';
const REGISTER_URL = '/api/users/signup';

export const userLoginRequest = () => ({
	type: actions.USER_LOGIN_REQUEST,
});

export const userLoginSuccess = (user) => ({
	type: actions.USER_LOGIN_SUCCESS,
	payload: user,
});

export const userLoginFail = (error) => ({
	type: actions.USER_LOGIN_FAIL,
	payload: error,
});

export const userLogout = () => ({
	type: actions.USER_LOGOUT_SUCCESS,
});

const authRequest = (url, data) => async (dispatch) => {
	dispatch(userLoginRequest());
	try {
		const res = await axios.post(url, data);
		localStorage.setItem('userInfo', JSON.stringify(res.data));
		dispatch(userLoginSuccess(res.data));
	} catch (err) {
		dispatch(userLoginFail(err.message));
	}
};

export const authRegister = (data) => (dispatch) =>
	dispatch(authRequest(REGISTER_URL, data));

export const authLogin = (data) => (dispatch) =>
	dispatch(authRequest(LOGIN_URL, data));

export const authLogout = () => (dispatch) => {
	localStorage.removeItem('userInfo');
	dispatch(userLogout);
};

export const fetchUserRegister = (data) => async (dispatch) => {
	const { email, username, password } = data;
	dispatch(userRegisterRequest());
	try {
		const res = await axios.post('/api/users/signup', {
			email,
			username,
			password,
		});
		const user = res.data;
		localStorage.setItem('userInfo', JSON.stringify(res.data));
		dispatch(userRegisterSuccess(user));
	} catch (err) {
		const error = err.message;
		dispatch(userRegisterFail(error));
	}
};
