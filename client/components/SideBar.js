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

import NextLink from 'next/link';

const drawerWidth = '20%';

const useStyles = makeStyles((theme) => ({
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

const SideBar = ({ currentUser }) => {
	const classes = useStyles();

	return (
		<Drawer
			className={classes.drawer}
			variant="permanent"
			classes={{
				paper: classes.drawerPaper,
			}}
			anchor="left"
		>
			<List>
				<NextLink href="/post/createPost">
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
				</NextLink>

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
						primary={currentUser.username.toUpperCase()}
						style={{
							color: 'white',
							textAlign: 'center',
							fontWeight: '1000',
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

				<NextLink href="/tags/createTag">
					<ListItem button>
						<ListItemIcon>
							<LoyaltyIcon style={{ color: 'white' }} />
						</ListItemIcon>
						<ListItemText primary="Tags" style={{ color: 'white' }} />
					</ListItem>
				</NextLink>

				<ListItem button>
					<ListItemIcon>
						<ChatIcon style={{ color: 'white' }} />
					</ListItemIcon>
					<ListItemText primary="Diskusi saya" style={{ color: 'white' }} />
				</ListItem>
			</List>
		</Drawer>
	);
};

export default SideBar;
