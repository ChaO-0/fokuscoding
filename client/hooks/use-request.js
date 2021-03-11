import axios from 'axios';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Toast from '../components/Toast';
import { open } from '../redux/ducks/openload';

const useRequest = ({ url, method, onSuccess }) => {
	const [errors, setErrors] = useState(null);
	const dispatch = useDispatch();
	const doRequest = async (body) => {
		try {
			setErrors(null);
			const response = await axios[method](url, body);

			if (onSuccess) {
				onSuccess(response.data);
				if (!localStorage.getItem('currentUser')) {
					localStorage.setItem('currentUser', JSON.stringify(response.data));
				}
			}

			return response.data;
		} catch (err) {
			// console.log(err.response.data);
			dispatch(open(true));
			setErrors(
				<Toast autoHideDuration={6000} severity="error">
					<>
						{err.response.data.errors.map((err) => (
							<span key={err.message}>{err.message}</span>
						))}
					</>
				</Toast>
			);
		}
	};

	return { doRequest, errors };
};

export default useRequest;
