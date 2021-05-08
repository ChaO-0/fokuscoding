import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import { LinearProgress, Typography } from '@material-ui/core';

import Layout from '../../components/Layout';
import PostList from '../../components/PostList';

const MyPost = () => {
	const [nextPosts, setNextPosts] = useState([]);
	const [offset, setOffset] = useState(0);
	const [hasMore, setHasMore] = useState(true);

	const fetchMoreData = async () => {
		const username = JSON.parse(localStorage.getItem('currentUser')).username;
		const { data } = await axios.get(
			`/api/posts?offset=${offset}&limit=10&username=${username}`
		);
		if (data.docs.length === 0) {
			setHasMore(false);
		}

		setTimeout(() => {
			setNextPosts((prev) => [...prev, ...data.docs]);
		}, 1500);
		setOffset((prev) => prev + 10);
	};

	useEffect(async () => {
		const username = JSON.parse(localStorage.getItem('currentUser')).username;
		const { data } = await axios.get(
			`/api/posts?offset=${offset}&limit=10&username=${username}`
		);

		if (data.docs.length === 0) {
			setHasMore(false);
		}

		setNextPosts(data.docs);
		setOffset((prev) => prev + 10);
	}, []);

	return (
		<Layout>
			<>
				{nextPosts.length !== 0 ? (
					<InfiniteScroll
						dataLength={nextPosts.length}
						next={fetchMoreData}
						hasMore={hasMore}
						loader={<LinearProgress />}
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
								commentCount={post.comments.length}
								editButton
								deleteButton
							/>
						))}
					</InfiniteScroll>
				) : (
					<Typography
						variant="h4"
						color="secondary"
						style={{ fontWeight: 'bold' }}
						gutterBottom
					>
						Anda belum membuat diskusi
					</Typography>
				)}
			</>
		</Layout>
	);
};

export default MyPost;
