import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import thunk from 'redux-thunk';
import authReducer from './reducers/authReducer';

const composeEnhancers =
	(typeof window != 'undefined' &&
		window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
	compose;

const combinedReducer = combineReducers({
	authReducer,
});

const reducer = (state, action) => {
	if (action.type === HYDRATE) {
		const nextState = {
			...state,
			...action.payload,
		};
		return nextState;
	} else {
		return combinedReducer(state, action);
	}
};

const makeStore = () =>
	createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

export const wrapper = createWrapper(makeStore);
