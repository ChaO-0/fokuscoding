import React from 'react';
import { Box } from '@material-ui/core';

import axios from 'axios';
import PostList from '../components/PostList';
import Layout from '../components/Layout';

const Home = ({ currentUser }) => {
	return (
		<Layout currentUser={currentUser}>
			<>
				<PostList title="lorem ipsum dolor sit amet hahahah" />
			</>
		</Layout>
	);
};

export const getServerSideProps = async ({ req }) => {
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
