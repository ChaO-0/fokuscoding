import React, { useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import PostList from '../components/PostList';
import Layout from '../components/Layout';
import { LinearProgress } from '@material-ui/core';

const Home = ({ posts }) => {
	const [nextPosts, setNextPosts] = useState(posts?.docs || []);
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
	};

	return (
		<Layout>
			<>
				<InfiniteScroll
					dataLength={nextPosts.length}
					next={fetchMoreData}
					hasMore={hasMore}
					loader={<LinearProgress />}
					endMessage={<h4>Tidak ada yang dapat ditampilkan lagi</h4>}
				>
					{nextPosts.map((post) => (
						<PostList
							hasSolution={post.has_solution}
							key={post.id}
							title={post.title}
							voteCount={
								post.votes.filter((vote) => vote.type === 'up').length -
								post.votes.filter((vote) => vote.type === 'down').length
							}
							tags={post.tags}
							createdBy={post.username}
							time={moment(post.createdAt).fromNow()}
							postId={post.id}
							commentCount={post.comments.length}
						/>
					))}
				</InfiniteScroll>
			</>
		</Layout>
	);
};

export const getServerSideProps = async ({ req }) => {
	const getPosts = async () => {
		try {
			const { data } = await axios.get(
				`${process.env.INGRESS_URI}/api/posts?offset=0&limit=10`,
				{
					headers: req.headers,
				}
			);
			return data;
		} catch {
			return [];
		}
	};

	const posts = await getPosts();

	return {
		props: {
			posts,
		},
	};
};

export default Home;
