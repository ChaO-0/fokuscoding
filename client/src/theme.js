import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#56E6CA',
		},
		secondary: {
			main: '#4CC9B0',
		},
		error: {
			main: red.A400,
		},
		background: {
			default: '#F6F6F6',
		},
	},
	typography: {
		fontFamily: 'Roboto',
	},
});

export default theme;
