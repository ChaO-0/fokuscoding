import { useState } from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { open } from '../redux/ducks/openload';

const Toast = (props) => {
	const dispatch = useDispatch();

	const openValue = useSelector((state) => state.openLoad.open);

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		dispatch(open(false));
	};
	return (
		<Snackbar
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'center',
			}}
			open={openValue}
			onClose={handleClose}
			autoHideDuration={2000}
		>
			<Alert elevation={6} variant="filled" {...props} onClose={handleClose}>
				{props.children}
			</Alert>
		</Snackbar>
	);
};

export default Toast;
