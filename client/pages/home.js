import React from 'react';
import moment from 'moment';
import axios from 'axios';
import PostList from '../components/PostList';
import Layout from '../components/Layout';

const Home = ({ currentUser, posts }) => {
	return (
		<Layout currentUser={currentUser}>
			<>
				{posts.docs.map((post) => (
					<PostList
						key={post.id}
						title={post.title}
						voteCount={
							post.votes.filter((vote) => vote.type === 'up').length -
							post.votes.filter((vote) => vote.type === 'down').length
						}
						tags={post.tags}
						createdBy={post.username}
						time={moment(post.updatedAt).fromNow()}
					/>
				))}
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

	const { data: posts } = await axios.get(
		`${process.env.INGRESS_URI}/api/posts`,
		{
			headers: req.headers,
		}
	);

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
			posts,
		},
	};
};

export default Home;
