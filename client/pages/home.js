import React from 'react';
import { Box } from '@material-ui/core';

import axios from 'axios';
import PostList from '../components/PostList';
import Layout from '../components/Layout';

const Home = ({ currentUser }) => {
	return (
		<Box display="flex">
			<Layout currentUser={currentUser}>
				<>
					<Box display="flex" justifyContent="flex-end">
						HeapOverFlow
					</Box>
					<PostList title="lorem ipsum dolor sit amet hahahah" />
				</>
			</Layout>
		</Box>
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
