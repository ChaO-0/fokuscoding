import {
	Grid,
	Container,
	Typography,
	makeStyles,
	createMuiTheme,
	ThemeProvider,
	Box,
} from '@material-ui/core';
import PostList from '../components/PostList';
import Loginform from '../components/LoginForm';

const useStyles = makeStyles((theme) => ({
	containerPad: {
		paddingTop: theme.spacing(7),
	},
	gridPad: {
		paddingTop: theme.spacing(10),
	},
	postList: {
		height: '70vh',
		overflowY: 'scroll',
	},
	// label: {
	//   '&.Mui-focused': {
	//     color: 'black',
	//   },
	// },
}));

const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#56E6CA',
		},
		secondary: {
			main: '#4CC9B0',
		},
	},
	typography: {
		h3: {
			fontSize: 35,
		},
	},
});

function Index() {
	const classes = useStyles();
	return (
		<ThemeProvider theme={theme}>
			<Container className={classes.containerPad}>
				<Typography variant="h3" color="primary">
					<Box fontWeight={600}>HeapOverflow</Box>
				</Typography>
				<Grid
					container
					className={classes.gridPad}
					spacing={10}
					justify="center"
				>
					<Grid item sm={12} md={6} className={classes.postList}>
						<PostList />
						<PostList />
						<PostList />
						<PostList />
					</Grid>
					<Grid item sm={12} md={6}>
						<Loginform />
					</Grid>
				</Grid>
			</Container>
		</ThemeProvider>
	);
}

export default Index;
