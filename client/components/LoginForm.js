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
	CircularProgress,
} from '@material-ui/core';
import { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import useRequest from '../hooks/use-request';
import { Formik, useField, Form } from 'formik';
import TextInput from './TextInput';

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
	circular: {
		position: 'absolute',
		right: '39%',
		top: '23%',
	},
	wrapper: {
		position: 'relative',
	},
}));

const loginForm = () => {
	const classes = useStyles();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const { doRequest } = useRequest({
		url: '/api/users/signin',
		method: 'post',
		onSuccess: () => router.push('/home'),
	});

	return (
		<Card className={classes.container}>
			<CardContent>
				<Typography variant="h4" align="center" color="secondary">
					<Box fontWeight="bold">Login</Box>
				</Typography>
				<Container maxWidth="xs">
					<Formik
						initialValues={{ email: '', password: '' }}
						onSubmit={(values, { resetForm }) => {
							setLoading(true);
							setTimeout(() => {
								doRequest(values);
								setLoading(false);
							}, 1000);
							resetForm({});
						}}
					>
						<Form>
							<FormGroup>
								<FormControl className={classes.formPad}>
									<TextInput label="Email" name="email" />
								</FormControl>
								<FormControl className={classes.formPad}>
									<TextInput label="Password" name="password" type="password" />
								</FormControl>
								<Box m="auto" py={3} className={classes.wrapper}>
									<Button
										variant="contained"
										color="secondary"
										className={classes.loginButton}
										disabled={loading}
										size="small"
										type="submit"
									>
										LOGIN
									</Button>
									{loading ? (
										<CircularProgress
											size={30}
											color="secondary"
											className={classes.circular}
										/>
									) : null}
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
