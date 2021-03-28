import React, { useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import PostList from '../components/PostList';
import Layout from '../components/Layout';
import { LinearProgress } from '@material-ui/core';

const Home = ({ currentUser, posts }) => {
	const [nextPosts, setNextPosts] = useState(posts.docs);
	const [offset, setOffset] = useState(10);
	const [hasMore, setHasMore] = useState(true);

	const fetchMoreData = async () => {
		const { data } = await axios.get(`/api/posts?offset=${offset}&limit=10`);
		if (data.docs.length === 0) {
			setHasMore(false);
		}

		setTimeout(() => {
			setNextPosts((prev) => [...prev, ...data.docs]);
		}, 1500);
		setOffset((prev) => prev + 10);
		console.log(nextPosts);
	};

	console.log(nextPosts);

	return (
		<Layout currentUser={currentUser}>
			<>
				<InfiniteScroll
					dataLength={nextPosts.length}
					next={fetchMoreData}
					hasMore={hasMore}
					loader={<LinearProgress />}
					endMessage={<h1>This is end</h1>}
				>
					{nextPosts.map((post) => (
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
							postId={post.id}
						/>
					))}
				</InfiniteScroll>
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
		`${process.env.INGRESS_URI}/api/posts?offset=0&limit=10`,
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
