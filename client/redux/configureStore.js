import { combineReducers, createStore } from 'redux';
import openLoadReducer from './ducks/openload';

const reducer = combineReducers({
	openLoad: openLoadReducer,
});

const store = createStore(reducer);

export default store;
