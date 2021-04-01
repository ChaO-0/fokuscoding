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
import RegisterForm from '../components/RegisterForm';

const useStyles = makeStyles((theme) => ({
	brand: {
		fontSize: 35,
	},
	padTop: {
		paddingTop: theme.spacing(7),
	},
}));

const Register = () => {
	const classes = useStyles();
	return (
		<Container className={classes.padTop}>
			<Typography className={classes.brand} color="primary" component="div">
				<img src="/brand_logo.svg" alt="Logo Brand" width="25%" />
			</Typography>
			<Container maxWidth="md">
				<RegisterForm />
			</Container>
		</Container>
	);
};

export const getServerSideProps = async () => {
	if (typeof window === 'undefined') console.log('Server');
	else console.log('Browser');

	return {
		props: {
			test: 1,
		},
	};
};

export default Register;
