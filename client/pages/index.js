import {
	Grid,
	Container,
	Typography,
	makeStyles,
	createMuiTheme,
	ThemeProvider,
	Box,
	Button,
} from '@material-ui/core';
import PostList from '../components/PostList';
import moment from 'moment';
import axios from 'axios';
import MyDialogBox from '../components/MyDialogBox';
import Router from 'next/router';

const useStyles = makeStyles((theme) => ({
	containerPad: {
		paddingTop: theme.spacing(7),
	},
	gridPad: {
		paddingTop: theme.spacing(10),
	},
	postList: {
		// height: '70vh',
		// overflowY: 'scroll',
	},
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

const Index = ({ posts }) => {
	const classes = useStyles();

	return (
		<ThemeProvider theme={theme}>
			<Container className={classes.containerPad}>
				<Box display="flex" justifyContent="flex-end">
					<Box display="flex" flexGrow={1} alignItems="center">
						<Typography variant="h3" color="primary">
							<img src="/logo_fokus.png" alt="logo fokus" width="25%" />
						</Typography>
					</Box>
					<Box display="flex" alignItems="center">
						<MyDialogBox buttonText="Login" buttonColor="#4CC9B0" showLogin />
						<Button
							style={{
								backgroundColor: '#4C72C9',
								color: 'white',
								marginLeft: '10px',
							}}
							variant="contained"
							onClick={() => Router.push('/register')}
						>
							Register
						</Button>
					</Box>
				</Box>
				<Grid
					container
					className={classes.gridPad}
					spacing={10}
					justify="center"
				>
					<Grid item sm={12} md={12} className={classes.postList}>
						{posts.docs.map((post) => (
							<PostList
								key={post.id}
								title={post.title}
								voteCount={
									post.votes.filter((vote) => vote.type === 'up').length -
									post.votes.filter((vote) => vote.type === 'down').length
								}
								tags={post.tags}
								createdBy={post.username}
								time={moment(post.createdAt).fromNow()}
							/>
						))}
					</Grid>
				</Grid>
			</Container>
		</ThemeProvider>
	);
};

export const getServerSideProps = async ({ req }) => {
	const { data } = await axios.get(
		`${process.env.INGRESS_URI}/api/users/currentuser`,
		{
			headers: req.headers,
		}
	);

	if (data.currentUser) {
		return {
			redirect: {
				destination: '/home',
				permanent: false,
			},
		};
	}
	const { data: dataPost } = await axios.get(
		`${process.env.INGRESS_URI}/api/posts?limit=4`,
		{
			headers: req.headers,
		}
	);

	return {
		props: {
			posts: dataPost,
		},
	};
};

export default Index;
