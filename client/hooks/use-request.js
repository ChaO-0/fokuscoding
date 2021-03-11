import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, onSuccess }) => {
	const [errors, setErrors] = useState(null);

	const doRequest = async (body) => {
		try {
			setErrors(null);
			const response = await axios[method](url, body);

			if (onSuccess) {
				onSuccess(response.data);
				if (response.data.currentUser) {
					localStorage.setItem('currentUser', JSON.stringify(response.data));
				}
			}

			return response.data;
		} catch (err) {
			console.log(err.response.data);
			setErrors(
				<div>
					<h4>Ooops....</h4>
					<ul>
						{err.response.data.errors.map((err) => (
							<li key={err.message}>{err.message}</li>
						))}
					</ul>
				</div>
			);
		}
	};

	return { doRequest, errors };
};

export default useRequest;
