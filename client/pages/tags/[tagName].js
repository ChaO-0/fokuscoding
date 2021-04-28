import Layout from '../../components/Layout';
import PostList from '../../components/PostList';
import axios from 'axios';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
	LinearProgress,
	Card,
	CardContent,
	Typography,
} from '@material-ui/core';
import moment from 'moment';

const TagShow = ({ posts, tag }) => {
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
	};

	return (
		<Layout>
			<InfiniteScroll
				dataLength={nextPosts.length}
				next={fetchMoreData}
				hasMore={hasMore}
				loader={<LinearProgress />}
				endMessage={<h4>Tidak ada yang dapat ditampilkan lagi</h4>}
			>
				<Card style={{ marginBottom: 30 }}>
					<CardContent>
						<Typography variant="h4" gutterBottom>
							{tag.name}
						</Typography>
						<Typography variant="body1" component="div">
							{tag.description}
						</Typography>
					</CardContent>
				</Card>
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
						time={moment(post.createdAt).fromNow()}
						postId={post.id}
					/>
				))}
			</InfiniteScroll>
		</Layout>
	);
};

export const getServerSideProps = async ({ req, query }) => {
	const { tagName } = query;
	const { data } = await axios.get(
		`${process.env.INGRESS_URI}/api/posts?offset=0&limit=10&tags=${tagName}`,
		{
			headers: req.headers,
		}
	);

	const { data: tagData } = await axios.get(
		`${process.env.INGRESS_URI}/api/tags/${tagName}`,
		{
			headers: req.headers,
		}
	);

	console.log(tagData);

	return {
		props: {
			posts: data,
			tag: tagData,
		},
	};
};

export default TagShow;
