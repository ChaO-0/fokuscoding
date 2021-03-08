import { makeStyles } from '@material-ui/core';
import { useField } from 'formik';
import { InputLabel, InputBase, FormHelperText } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	input: {
		marginTop: theme.spacing(3),
		backgroundColor: '#00000012',
		borderRadius: 4,
		padding: theme.spacing(0.3, 2),
		width: 'auto',
		'&.Mui-error': {
			border: 'solid 1px #FF7171',
		},
		'&.Mui-focused': {
			border: 'solid 1px #56E6CA',
		},
	},
	error: {
		color: '#FF0D39',
	},
}));

const TextInput = ({ label, ...props }) => {
	const [field, meta] = useField(props);
	const classes = useStyles();
	return (
		<>
			<InputLabel shrink htmlFor={props.id || props.name}>
				{label}
			</InputLabel>
			<InputBase
				{...field}
				{...props}
				className={classes.input}
				error={meta.touched && Boolean(meta.error)}
			/>
			{meta.touched && meta.error ? (
				<FormHelperText className={classes.error}>{meta.error}</FormHelperText>
			) : null}
		</>
	);
};

export default TextInput;
