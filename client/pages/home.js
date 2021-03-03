import React from 'react';
import {
	makeStyles,
	Drawer,
	Box,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	InputBase,
	Button,
} from '@material-ui/core';
import {
	Home as HomeIcon,
	Search as SearchIcon,
	Chat as ChatIcon,
	Loyalty as LoyaltyIcon,
} from '@material-ui/icons';
import axios from 'axios';
import PostList from '../components/PostList';

const drawerWidth = '20%';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	appBar: {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: drawerWidth,
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		width: drawerWidth,
		backgroundColor: '#4C72C9',
	},
	// necessary for content to be below app bar
	content: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.default,
		padding: theme.spacing(3),
	},
}));

const Home = ({ currentUser }) => {
	const classes = useStyles();

	return (
		<Box className={classes.root}>
			<Drawer
				className={classes.drawer}
				variant="permanent"
				classes={{
					paper: classes.drawerPaper,
				}}
				anchor="left"
			>
				<List>
					<ListItem style={{ padding: '25px 0' }}>
						<ListItemText
							primary="Mulai Diskusi"
							style={{
								color: 'white',
								textAlign: 'center',
								cursor: 'pointer',
							}}
						/>
					</ListItem>
					<ListItem
						style={{
							width: '40%',
							border: '3px solid white',
							padding: '1px 0',
							margin: '20px auto',
							borderRadius: 100,
							cursor: 'pointer',
						}}
					>
						<ListItemText
							primary={currentUser.username}
							style={{
								color: 'white',
								textAlign: 'center',
							}}
						/>
					</ListItem>
					<ListItem>
						<Box display="flex" py={1}>
							<InputBase
								style={{
									width: '100%',
									borderTopLeftRadius: 50,
									borderBottomLeftRadius: 50,
									backgroundColor: 'white',
									padding: '5px 15px',
								}}
								placeholder="Cari diskusi"
							/>
							<Button
								style={{
									borderRadius: '0px 50px 50px 0px',
									boxShadow: 'none',
								}}
								variant="contained"
								color="primary"
							>
								<SearchIcon />
							</Button>
						</Box>
					</ListItem>
					<ListItem button>
						<ListItemIcon>
							<HomeIcon style={{ color: 'white' }} />
						</ListItemIcon>
						<ListItemText primary="Beranda" style={{ color: 'white' }} />
					</ListItem>
					<ListItem button>
						<ListItemIcon>
							<LoyaltyIcon style={{ color: 'white' }} />
						</ListItemIcon>
						<ListItemText primary="Tags" style={{ color: 'white' }} />
					</ListItem>
					<ListItem button>
						<ListItemIcon>
							<ChatIcon style={{ color: 'white' }} />
						</ListItemIcon>
						<ListItemText primary="Diskusi saya" style={{ color: 'white' }} />
					</ListItem>
				</List>
			</Drawer>
			<main className={classes.content}>
				<Box>test</Box>
				<PostList />
			</main>
		</Box>
	);
};

export const getServerSideProps = async ({ req }) => {
	const { data } = await axios.get(
		`${process.env.INGRESS_URI}/api/users/currentuser`,
		{
			headers: req.headers,
		}
	);
	console.log(data);
	if (!data.currentUser) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}
	return {
		props: {
			currentUser: data.currentUser,
		},
	};
};

export default Home;
