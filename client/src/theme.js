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
	overrides: {
		MuiCssBaseline: {
			'@global': {
				blockquote: {
					borderLeft: '3px solid gray',
					paddingLeft: '10px',
					background: '#80808026',
					fontStyle: 'italic',
					padding: '3px 3px 3px 10px',
					marginLeft: '0',
				},
				pre: {
					background: '#8080803d',
					borderRadius: '3px',
					padding: '10px',
				},
			},
		},
	},
});

export default theme;
