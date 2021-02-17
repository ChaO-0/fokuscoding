import buildClient from '../api/build-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/global.css';

function MyApp({ Component, pageProps }) {
	return <Component {...pageProps} />;
}

MyApp.getInitialProps = async (appContext) => {
	const client = buildClient(appContext.ctx);
	const { data } = await client.get('/api/users/currentuser');

	let pageProps = {};
	if (appContext.Component.getInitialProps) {
		pageProps = await appContext.Component.getInitialProps(
			appContext.ctx,
			client,
			data.currentUser
		);
	}

	console.log(pageProps);

	return { pageProps, ...data };
};

export default MyApp;
