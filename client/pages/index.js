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
import moment from 'moment';
import axios from 'axios';

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

const Index = ({ posts }) => {
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
								time={moment(post.updatedAt).fromNow()}
							/>
						))}
					</Grid>
					<Grid item sm={12} md={6}>
						<Loginform />
					</Grid>
				</Grid>
			</Container>
		</ThemeProvider>
	);
};

export const getServerSideProps = async ({ req }) => {
	const { data } = await axios.get(
		`${process.env.INGRESS_URI}/api/posts?limit=4`,
		{
			headers: req.headers,
		}
	);

	return {
		props: {
			posts: data,
		},
	};
};

export default Index;
