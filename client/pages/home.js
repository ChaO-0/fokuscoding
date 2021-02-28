import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Home = ({ currentUser }) => {
	const router = useRouter();
	const user = useSelector((state) => state.authReducer.user);
	useEffect(() => {
		if (!currentUser) router.push('/');
		console.log(user);
	}, []);
	return <h1>Test</h1>;
};

export const getServerSideProps = async ({ req, res }) => {
	const { data } = await axios.get(
		`${process.env.INGRESS_URI}/api/users/currentuser`,
		{
			headers: req.headers,
		}
	);
	console.log(data);
	if (!data.currentUser) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}
	return {
		props: {
			currentUser: data.currentUser,
		},
	};
};

export default Home;
