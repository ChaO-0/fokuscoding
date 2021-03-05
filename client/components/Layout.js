import SideBar from './SideBar';
import PropTypes from 'prop-types';
import { makeStyles, Box, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	// necessary for content to be below app bar
	content: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.default,
		padding: theme.spacing(3),
	},
}));
const Layout = (props) => {
	const classes = useStyles();
	return (
		<Box display="flex">
			<SideBar currentUser={props.currentUser} />
			<main className={classes.content}>
				<Box display="flex" justifyContent="flex-end" pb={4}>
					<Typography variant="h3" color="primary" style={{ fontWeight: 600 }}>
						HeapOverflow
					</Typography>
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
