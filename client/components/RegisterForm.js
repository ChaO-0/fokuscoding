import {
	Typography,
	Box,
	makeStyles,
	Container,
	Card,
	CardContent,
	FormGroup,
	FormControl,
	FormHelperText,
	InputLabel,
	InputBase,
	Button,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';
import NextLink from 'next/link';

const useStyles = makeStyles((theme) => ({
	registerButton: {
		color: theme.palette.common.white,
		width: theme.spacing(20),
		borderRadius: 10,
		fontWeight: 'bold',
		fontSize: 16,
	},
	cardMargin: {
		marginTop: theme.spacing(3.5),
	},
	registerLogo: {
		fontSize: 35,
		textAlign: 'center',
	},
	registerFooterTypography: {
		textAlign: 'center',
		color: '#919191',
	},
	login: {
		textDecoration: 'underline',
		cursor: 'pointer',
	},
	input: {
		marginTop: theme.spacing(3),
		backgroundColor: '#00000012',
		borderRadius: 4,
		padding: theme.spacing(0.3, 2),
		width: 'auto',
		'&.Mui-error': {
			border: 'solid 1px #FF7171',
		},
	},
	error: {
		color: '#FF0D39',
	},
	formPad: {
		margin: theme.spacing(1, 0),
	},
}));

const RegisterForm = () => {
	const classes = useStyles();
	const validationSchema = yup.object({
		email: yup
			.string('Enter your email')
			.email('Enter a valid email')
			.required('Email is required'),
		password: yup
			.string('Enter your password')
			.min(4, 'Password should be of minimum 4 characters')
			.required('Password is required'),
		username: yup
			.string('Enter your username')
			.min(4, 'Username should be of minimum 4 characters')
			.required('Username is required'),
	});
	const formik = useFormik({
		initialValues: {
			email: '',
			username: '',
			password: '',
		},
		validationSchema,
		onSubmit: (values) => alert(JSON.stringify(values)),
	});
	const isError = (target) =>
		formik.touched[target] && Boolean(formik.errors[target]);

	return (
		<Card className={classes.cardMargin}>
			<CardContent>
				<Typography
					component="div"
					className={classes.registerLogo}
					color="secondary"
				>
					<Box fontWeight={600}>Register</Box>
				</Typography>
				<Container maxWidth="xs">
					<form onSubmit={formik.handleSubmit}>
						<FormGroup>
							<FormControl className={classes.formPad}>
								<InputLabel shrink htmlFor="email">
									Email
								</InputLabel>
								<InputBase
									type="email"
									name="email"
									className={classes.input}
									value={formik.values.email}
									onChange={formik.handleChange}
									error={isError('email')}
								></InputBase>
								{isError('email') && (
									<FormHelperText className={classes.error}>
										{formik.errors.email}
									</FormHelperText>
								)}
							</FormControl>
							<FormControl className={classes.formPad}>
								<InputLabel shrink htmlFor="username">
									Username
								</InputLabel>
								<InputBase
									className={classes.input}
									name="username"
									value={formik.values.username}
									onChange={formik.handleChange}
									error={isError('username')}
								></InputBase>
								{isError('username') && (
									<FormHelperText className={classes.error}>
										{formik.errors.username}
									</FormHelperText>
								)}
							</FormControl>
							<FormControl className={classes.formPad}>
								<InputLabel shrink htmlFor="password">
									Password
								</InputLabel>
								<InputBase
									className={classes.input}
									type="password"
									name="password"
									value={formik.values.password}
									onChange={formik.handleChange}
									error={isError('password')}
								></InputBase>
								{isError('password') && (
									<FormHelperText className={classes.error}>
										{formik.errors.password}
									</FormHelperText>
								)}
							</FormControl>
							<Box m="auto" pt={3} pb={2}>
								<Button
									variant="contained"
									color="secondary"
									className={classes.registerButton}
									size="small"
									type="submit"
								>
									REGISTER
								</Button>
							</Box>
							<Box className={classes.registerFooterTypography}>
								<Typography variant="caption" component="div" display="inline">
									Or{' '}
								</Typography>
								<NextLink href="/">
									<Typography
										variant="caption"
										component="div"
										display="inline"
										className={classes.login}
									>
										Login
									</Typography>
								</NextLink>
							</Box>
						</FormGroup>
					</form>
				</Container>
			</CardContent>
		</Card>
	);
};

export default RegisterForm;
