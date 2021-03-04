import SideBar from './SideBar';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

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
		<>
			<SideBar currentUser={props.currentUser} />
			<main className={classes.content}>{props.children}</main>
		</>
	);
};

Layout.propTypes = {
	children: PropTypes.element.isRequired,
};

export default Layout;
