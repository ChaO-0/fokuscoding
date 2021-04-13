import { useState } from 'react';
import dynamic from 'next/dynamic';

import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@material-ui/core';

const SimpleMDE = dynamic(() => import('./SimpleMDE'), {
	ssr: false,
});

const MyDialogBox = ({
	buttonText,
	buttonColor,
	dialogTitle,
	dialogText,
	acceptText,
	request,
	showForm,
	setText,
}) => {
	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	const handleRequest = async () => {
		await request();
		// console.log(text);
		setOpen(false);
	};

	return (
		<>
			<Button onClick={handleClickOpen} style={{ color: buttonColor }}>
				{buttonText}
			</Button>
			<Dialog
				open={open}
				onClose={handleClose}
				// fullWidth={showForm}
				maxWidth={showForm && 'md'}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						{dialogText}
					</DialogContentText>
					{showForm && (
						<SimpleMDE value={showForm} onChange={(val) => setText(val)} />
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button
						onClick={handleRequest}
						style={{ color: buttonColor }}
						autoFocus
					>
						{acceptText}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default MyDialogBox;
