import SideBar from './SideBar';
import PropTypes from 'prop-types';
import { makeStyles, Box } from '@material-ui/core';
import { useEffect, useState } from 'react';
import Router from 'next/router';

const useStyles = makeStyles((theme) => ({
	content: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.default,
		padding: theme.spacing(3),
	},
}));
const Layout = (props) => {
	const classes = useStyles();

	const [authorization, setAuthorization] = useState(true);
	const [currentUser, setCurrentUser] = useState({});

	useEffect(() => {
		if (!localStorage.getItem('currentUser')) {
			Router.push('/');
			setAuthorization(false);
		} else {
			setCurrentUser(JSON.parse(localStorage.getItem('currentUser')));
		}
	}, []);

	if (!authorization) {
		return (
			<div>
				<h1>Not Authorized</h1>
				<p>Redirecting...</p>
			</div>
		);
	}

	return (
		<Box display="flex">
			<SideBar currentUser={currentUser} />
			<main className={classes.content}>
				<Box display="flex" justifyContent="flex-end" pb={4}>
					<img src="/brand_logo.svg" alt="Logo Brand" width="35%" />
				</Box>
				{props.children}
			</main>
		</Box>
	);
};

Layout.propTypes = {
	children: PropTypes.element.isRequired,
};

export default Layout;
