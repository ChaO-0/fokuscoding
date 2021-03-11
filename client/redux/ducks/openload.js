const LOADING = 'loading';
const OPEN = 'open';

export const loading = (loading) => ({
	type: LOADING,
	payload: loading,
});
export const open = (open) => ({
	type: OPEN,
	payload: open,
});

const initialState = {
	loading: false,
	open: false,
};

const store = (state = initialState, action) => {
	switch (action.type) {
		case LOADING:
			return { ...state, loading: action.payload };
		case OPEN:
			return { ...state, open: action.payload };
		default:
			return state;
	}
};

export default store;
