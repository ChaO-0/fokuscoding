import { createStore, applyMiddleware, compose } from 'redux';
import { createWrapper } from 'next-redux-wrapper';
import thunk from 'redux-thunk';
import authReducer from './reducers/authReducer';

const composeEnhancers =
	(typeof window != 'undefined' &&
		window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
	compose;
const makeStore = (context) =>
	createStore(authReducer, composeEnhancers(applyMiddleware(thunk)));
export const wrapper = createWrapper(makeStore);
