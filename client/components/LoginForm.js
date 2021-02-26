import {
	Card,
	CardContent,
	Typography,
	Box,
	Container,
	FormGroup,
	FormControl,
	Button,
	makeStyles,
	InputLabel,
	InputBase,
} from '@material-ui/core';
import NextLink from 'next/link';
import { useState } from 'react';
import { Formik, useField, Form } from 'formik';

const useStyles = makeStyles((theme) => ({
	loginButton: {
		color: theme.palette.common.white,
		width: theme.spacing(20),
		borderRadius: 10,
		fontWeight: 'bold',
		fontSize: 16,
	},
	loginFooterTypography: {
		textAlign: 'center',
		color: '#919191',
	},
	register: {
		textDecoration: 'underline',
		cursor: 'pointer',
	},
	container: {
		maxWidth: '80%',
		margin: 'auto',
	},
	input: {
		marginTop: theme.spacing(3),
		backgroundColor: '#00000012',
		borderRadius: 4,
		padding: theme.spacing(0.3, 2),
		width: 'auto',
	},
	formPad: {
		margin: theme.spacing(1, 0),
	},
}));

const TextInput = ({ label, ...props }) => {
	const [field, meta] = useField(props);
	const classes = useStyles();
	return (
		<>
			<InputLabel shrink htmlFor={props.id || props.name}>
				{label}
			</InputLabel>
			<InputBase
				{...field}
				{...props}
				className={classes.input}
				error={meta.touched && Boolean(meta.error)}
			/>
			{meta.touched && meta.error ? (
				<FormHelperText>{meta.error}</FormHelperText>
			) : null}
		</>
	);
};

const loginForm = () => {
	const classes = useStyles();

	return (
		<Card className={classes.container}>
			<CardContent>
				<Typography variant="h4" align="center" color="secondary">
					<Box fontWeight="bold">Login</Box>
				</Typography>
				<Container maxWidth="xs">
					<Formik
						initialValues={{ username: '', password: '' }}
						onSubmit={(values, { resetForm }) => {
							alert(JSON.stringify(values));
							resetForm({});
						}}
					>
						<Form>
							<FormGroup>
								<FormControl className={classes.formPad}>
									<TextInput label="Username" name="username" />
								</FormControl>
								<FormControl className={classes.formPad}>
									<TextInput label="Password" name="password" type="password" />
								</FormControl>
								<Box m="auto" py={3}>
									<Button
										variant="contained"
										color="secondary"
										className={classes.loginButton}
										size="small"
										type="submit"
									>
										LOGIN
									</Button>
									<Box className={classes.loginFooterTypography} pt={2}>
										<Typography
											variant="caption"
											component="div"
											display="inline"
										>
											Or{' '}
										</Typography>
										<NextLink href="/register">
											<Typography
												variant="caption"
												component="div"
												display="inline"
												className={classes.register}
											>
												Register
											</Typography>
										</NextLink>
									</Box>
								</Box>
							</FormGroup>
						</Form>
					</Formik>
				</Container>
			</CardContent>
		</Card>
	);
};

export default loginForm;
