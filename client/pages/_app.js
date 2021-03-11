import PropTypes from 'prop-types';
import React from 'react';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';
import { wrapper } from '../redux/store';
import Router from 'next/router';
import NProgress from 'nprogress';
import moment from 'moment';
import '../assets/css/nprogress.css';
import store from '../redux/configureStore';
import { Provider } from 'react-redux';
moment.locale('id');
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());
function MyApp(props) {
	const { Component, pageProps } = props;

	React.useEffect(() => {
		// Remove the server-side injected CSS.
		const jssStyles = document.querySelector('#jss-server-side');
		if (jssStyles) {
			jssStyles.parentElement.removeChild(jssStyles);
		}
	}, []);

	return (
		<React.Fragment>
			<Head>
				<title>HeapOverflow</title>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
			</Head>
			<ThemeProvider theme={theme}>
				{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
				<CssBaseline />
				<Provider store={store}>
					<Component {...pageProps} />
				</Provider>
			</ThemeProvider>
		</React.Fragment>
	);
}

MyApp.propTypes = {
	Component: PropTypes.elementType.isRequired,
	pageProps: PropTypes.object.isRequired,
};

// MyApp.getInitialProps = async (appContext) => {
// 	const client = buildClient(appContext.ctx);
// 	// const { data } = await client.get('/api/users/currentuser');

// 	if (typeof window === 'undefined') {
// 		await axios.get(`${process.env.INGRESS_URI}/api/users/currentuser`, {
// 			headers: appContext.ctx.req.headers,
// 		});
// 		console.log('asd');
// 		// console.log(data);
// 	}
// 	// console.log(data);
// 	let pageProps = {};
// 	if (appContext.Component.getInitialProps) {
// 		pageProps = await appContext.Component.getInitialProps(
// 			appContext.ctx,
// 			client
// 			// data.currentUser
// 		);
// 	}

// 	return { pageProps };
// };

export default wrapper.withRedux(MyApp);
