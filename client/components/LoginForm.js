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
	CircularProgress,
} from '@material-ui/core';
import { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import useRequest from '../hooks/use-request';
import { Formik, Form } from 'formik';
import TextInput from './TextInput';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { open } from '../redux/ducks/openload';
import Toast from './Toast';

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

		margin: '50px auto 50px auto',
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
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const { doRequest, errors } = useRequest({
		url: '/api/users/signin',
		method: 'post',
		onSuccess: () =>
			setTimeout(async () => {
				await router.push('/home');
				dispatch(open(false));
			}, 1000),
	});
	const validationSchema = Yup.object({
		email: Yup.string('Enter your email')
			.email('Enter a valid email')
			.required('Email is required'),
		password: Yup.string('Enter your password').required(
			'Password is required'
		),
	});
	return (
		<>
			{errors ? (
				errors
			) : (
				<Toast severity="success">Login success, redirecting...</Toast>
			)}
			<Card className={classes.container}>
				<CardContent>
					<Typography variant="h4" align="center" color="secondary">
						<Box fontWeight="bold">Login</Box>
					</Typography>
					<Container maxWidth="xs">
						<Formik
							initialValues={{ email: '', password: '' }}
							validationSchema={validationSchema}
							onSubmit={async (values, { resetForm, setSubmitting }) => {
								setLoading(true);
								await doRequest(values);
								dispatch(open(true));
								setLoading(false);
								setSubmitting(false);
							}}
						>
							<Form>
								<FormGroup>
									<FormControl className={classes.formPad}>
										<TextInput label="Email" name="email" />
									</FormControl>
									<FormControl className={classes.formPad}>
										<TextInput
											label="Password"
											name="password"
											type="password"
										/>
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
										{loading && (
											<CircularProgress
												size={30}
												color="secondary"
												className={classes.circular}
											/>
										)}
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
		</>
	);
};

export default loginForm;
