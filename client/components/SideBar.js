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
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	withStyles,
	TextField,
} from '@material-ui/core';

import { Autocomplete } from '@material-ui/lab';

import {
	Home as HomeIcon,
	Search as SearchIcon,
	Chat as ChatIcon,
	Loyalty as LoyaltyIcon,
	LocalOffer as LocalOfferIcon,
	ExitToApp as ExitToAppIcon,
	Create as CreateIcon,
	RateReview as RateReviewIcon,
	QuestionAnswer as QuestionAnswerIcon,
	People as PeopleIcon,
} from '@material-ui/icons';

import NextLink from 'next/link';
import useRequest from '../hooks/use-request';
import Router from 'next/router';
import { Formik, Form, useField } from 'formik';
import { useRouter } from 'next/router';
import axios from 'axios';

const drawerWidth = '25%';

const useStyles = makeStyles((theme) => ({
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		zIndex: 1,
	},
	drawerPaper: {
		width: drawerWidth,
		backgroundColor: '#4C72C9',
	},

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

const SearchInput = ({ ...props }) => {
	const [field, meta] = useField(props);

	return (
		<InputBase
			style={{
				width: '100%',
				borderTopLeftRadius: 50,
				borderBottomLeftRadius: 50,
				backgroundColor: 'white',
				padding: '5px 15px',
			}}
			{...field}
			{...props}
		/>
	);
};

const CustomAutocomplete = withStyles({
	tag: {
		backgroundColor: '#4CC9B040',
		color: '#4CC9B0',
		borderRadius: 0,
		height: 30,
		position: 'relative',
		zIndex: 0,
		'& .MuiChip-label': {
			color: '#3e9987',
		},
		'& .MuiChip-deleteIcon': {
			color: '#656565',
		},
	},
})(Autocomplete);

const SideBar = () => {
	const classes = useStyles();
	const { doRequest, errors } = useRequest({
		url: '/api/users/signout',
		method: 'post',
		onSuccess: () => Router.push('/'),
	});
	const [currentUser, setCurrentUser] = useState({});
	const [navLists, setNavLists] = useState(initialNavLists);
	const [tagList, setTagList] = useState([]);
	const handleLogout = async () => {
		await doRequest();
		localStorage.removeItem('currentUser');
	};
	useEffect(async () => {
		try {
			setCurrentUser(JSON.parse(localStorage.getItem('currentUser')));

			if (JSON.parse(localStorage.getItem('currentUser')).is_admin) {
				setNavLists([
					...navLists,
					{
						name: 'Review Tag',
						href: '/tags/review',
						icon: <RateReviewIcon style={{ color: 'white' }} />,
					},
					{
						name: 'Daftar User',
						href: '/users',
						icon: <PeopleIcon style={{ color: 'white' }} />,
					},
				]);
			}

			const getTags = async () => await axios.get('/api/tags');
			const { data } = await getTags();
			setTagList(data);
			console.log(data);
		} catch {
			router.push('/');
		}
	}, []);
	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const router = useRouter();

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
					<Box display="flex" justifyContent="center" alignItems="center" p={5}>
						<Button
							size="large"
							startIcon={<QuestionAnswerIcon />}
							style={{
								color: 'white',
								textTransform: 'capitalize',
								fontSize: '16px',
							}}
						>
							Mulai Diskusi
						</Button>
					</Box>
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
					<Formik
						initialValues={{ query: '' }}
						onSubmit={(values) => {
							console.log(values);
							router.push(`/search?query=${values.query}`);
						}}
					>
						<Box width="100%">
							<Form>
								<Box display="flex" py={1} width="100%">
									<SearchInput
										type="text"
										name="query"
										placeholder="Cari diskusi"
									/>
									<Button
										style={{
											borderRadius: '0px 50px 50px 0px',
											boxShadow: 'none',
										}}
										variant="contained"
										color="primary"
										type="submit"
									>
										<SearchIcon />
									</Button>
								</Box>
								<Box
									display="flex"
									justifyContent="flex-end"
									style={{ color: 'white', cursor: 'pointer' }}
									onClick={handleClickOpen}
								>
									Advanced Search
								</Box>
								<Dialog
									open={open}
									onClose={handleClose}
									aria-labelledby="alert-dialog-title"
									aria-describedby="alert-dialog-description"
								>
									<DialogTitle id="alert-dialog-title">
										Cari Diskusi
									</DialogTitle>
									<DialogContent>
										<DialogContentText
											id="alert-dialog-description"
											component={'div'}
										>
											<Formik
												initialValues={{ query: '', tags: [] }}
												onSubmit={(values) => {
													const tagNames = values.tags.map((tag) => tag.name);
													values = { ...values, tags: tagNames };
													handleClose();
													router.push(
														`/search?query=${values.query}&tags=${tagNames}`
													);
												}}
											>
												{({ setFieldValue, setFieldTouched, values }) => (
													<Form>
														<Box display="flex" py={1} width="100%">
															<SearchInput
																type="text"
																name="query"
																placeholder="Cari diskusi"
															/>
															<Button
																style={{
																	borderRadius: '0px 50px 50px 0px',
																	boxShadow: 'none',
																}}
																variant="contained"
																color="primary"
																type="submit"
															>
																<SearchIcon />
															</Button>
														</Box>
														<CustomAutocomplete
															multiple
															options={tagList}
															getOptionLabel={(option) => option.name}
															noOptionsText="Tidak Ditemukan"
															onChange={(e, value) => {
																setFieldValue('tags', value);
															}}
															name="tags"
															renderInput={(params) => (
																<TextField
																	{...params}
																	variant="outlined"
																	style={{
																		marginTop: 20,
																		backgroundColor: '#00000012',
																		borderRadius: 4,
																		height: '100%',
																		outline: 'none',
																	}}
																	name="tags"
																/>
															)}
														/>
													</Form>
												)}
											</Formik>
										</DialogContentText>
									</DialogContent>
									<DialogActions>
										<Button onClick={handleClose} color="primary">
											Cancel
										</Button>
									</DialogActions>
								</Dialog>
							</Form>
						</Box>
					</Formik>
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
