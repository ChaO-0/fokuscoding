import { Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	buttonStyle: {
		color: theme.palette.common.white,
		width: theme.spacing(14),
		borderRadius: 10,
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
		>
			{props.children}
		</Button>
	);
};

export default MyButton;
