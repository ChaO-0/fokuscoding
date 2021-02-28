import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import thunk from 'redux-thunk';
import authReducer from './reducers/authReducer';

const bindMiddleware = (middleware) => {
	if (process.env.NODE_ENV !== 'production') {
		return composeWithDevTools(applyMiddleware(...middleware));
	}
	return applyMiddleware(...middleware);
};

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

const initStore = () => createStore(reducer, bindMiddleware([thunk]));

export const wrapper = createWrapper(initStore);
