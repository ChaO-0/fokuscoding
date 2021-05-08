import { Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	buttonStyle: {
		color: theme.palette.common.white,
		fontSize: 14,
	},
}));

const MyButton = (props) => {
	const classes = useStyles();
	return (
		<Button
			variant="contained"
			color="secondary"
			className={classes.buttonStyle}
			size="small"
			type="submit"
			{...props}
		>
			{props.children}
		</Button>
	);
};

export default MyButton;
