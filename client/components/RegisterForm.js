import {
	Typography,
	Box,
	makeStyles,
	Container,
	Card,
	CardContent,
	FormGroup,
	FormControl,
	InputLabel,
	InputBase,
	Button,
} from '@material-ui/core';
import { useState } from 'react';
import NextLink from 'next/link';
import useRequest from '../hooks/useRequest';

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
	},
	formPad: {
		margin: theme.spacing(1, 0),
	},
}));

const RegisterForm = () => {
	const classes = useStyles();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const { doRequest, errors } = useRequest({
		url: '/api/users/signup',
		method: 'post',
		body: {
			username,
			password,
			email,
		},
		onSuccess: (e) => console.log(e),
	});

	const handleSubmit = async (e) => {
		e.preventDefault();

		await doRequest();
	};

	const handleUsername = (e) => {
		setUsername(e.target.value);
	};

	const handlePassword = (e) => {
		setPassword(e.target.value);
	};

	const handleEmail = (e) => {
		setEmail(e.target.value);
	};

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
					<form onSubmit={handleSubmit}>
						<FormGroup>
							<FormControl className={classes.formPad}>
								<InputLabel shrink htmlFor="email">
									Email
								</InputLabel>
								<InputBase
									type="email"
									className={classes.input}
									value={email}
									onChange={handleEmail}
								></InputBase>
							</FormControl>
							<FormControl className={classes.formPad}>
								<InputLabel shrink htmlFor="username">
									Username
								</InputLabel>
								<InputBase
									className={classes.input}
									value={username}
									onChange={handleUsername}
								></InputBase>
							</FormControl>
							<FormControl className={classes.formPad}>
								<InputLabel shrink htmlFor="password">
									Password
								</InputLabel>
								<InputBase
									className={classes.input}
									value={password}
									onChange={handlePassword}
									type="password"
								></InputBase>
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
							{errors}
						</FormGroup>
					</form>
				</Container>
			</CardContent>
		</Card>
	);
};

export default RegisterForm;
