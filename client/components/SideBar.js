import { useEffect, useState } from 'react';
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
	LocalOffer as LocalOfferIcon,
	ExitToApp as ExitToAppIcon,
	Create as CreateIcon,
	RateReview as RateReviewIcon,
} from '@material-ui/icons';

import NextLink from 'next/link';
import useRequest from '../hooks/use-request';
import Router from 'next/router';

const drawerWidth = '25%';

const useStyles = makeStyles((theme) => ({
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		zIndex: 0,
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
	bottomPush: {
		position: 'fixed',
		bottom: 0,
		textAlign: 'right',
		paddingBottom: 10,
	},
	rotate: {
		transform: 'rotate(-180deg)',
	},
}));

const initialNavLists = [
	{
		name: 'Beranda',
		href: '/home',
		icon: <HomeIcon style={{ color: 'white' }} />,
	},
	{
		name: 'Tags',
		href: '/tags',
		icon: <LocalOfferIcon style={{ color: 'white' }} />,
	},
	{
		name: 'Tags Saya',
		href: '/tags/mytags',
		icon: <LoyaltyIcon style={{ color: 'white' }} />,
	},
	{
		name: 'Buat Tag',
		href: '/tags/createtag',
		icon: <CreateIcon style={{ color: 'white' }} />,
	},
	{
		name: 'Diskusi Saya',
		href: '/post',
		icon: <ChatIcon style={{ color: 'white' }} />,
	},
];

const SideBar = () => {
	const classes = useStyles();
	const { doRequest, errors } = useRequest({
		url: '/api/users/signout',
		method: 'post',
		onSuccess: () => Router.push('/'),
	});
	const [currentUser, setCurrentUser] = useState({});
	const [navLists, setNavLists] = useState(initialNavLists);
	const handleLogout = async () => {
		await doRequest();
		localStorage.removeItem('currentUser');
	};
	useEffect(() => {
		setCurrentUser(JSON.parse(localStorage.getItem('currentUser')));

		if (JSON.parse(localStorage.getItem('currentUser')).is_admin) {
			setNavLists([
				...navLists,
				{
					name: 'Review Tag',
					href: '/tags/review',
					icon: <RateReviewIcon style={{ color: 'white' }} />,
				},
			]);
		}
	}, []);

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
				<NextLink href="/post/createpost">
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

				<NextLink href="/profile">
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
							primary={currentUser.username?.toUpperCase()}
							style={{
								color: 'white',
								textAlign: 'center',
								fontWeight: '1000',
							}}
						/>
					</ListItem>
				</NextLink>
				<ListItem>
					<Box display="flex" py={1} width="100%">
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
				{navLists.map((navList) => (
					<NextLink href={navList.href} key={navList.name}>
						<ListItem button>
							<ListItemIcon>{navList.icon}</ListItemIcon>
							<ListItemText primary={navList.name} style={{ color: 'white' }} />
						</ListItem>
					</NextLink>
				))}
			</List>
			<Box
				display="flex"
				justifyContent="flex-end"
				alignItems="flex-end"
				css={{ height: '100vh' }}
				p={5}
			>
				<Button
					size="large"
					startIcon={<ExitToAppIcon className={classes.rotate} />}
					style={{ color: 'white' }}
					onClick={handleLogout}
				>
					Logout
				</Button>
			</Box>
		</Drawer>
	);
};

export default SideBar;
