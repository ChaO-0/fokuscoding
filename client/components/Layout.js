import SideBar from './SideBar';
import PropTypes from 'prop-types';
import { makeStyles, Box } from '@material-ui/core';

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
				<Box display="flex" justifyContent="flex-end">
					HeapOverFlow
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
