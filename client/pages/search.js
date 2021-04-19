import axios from 'axios';
import { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';
import Layout from '../components/Layout';
import PostList from '../components/PostList';
import moment from 'moment';

const Search = ({ query }) => {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		const fetchSearch = async () => {
			try {
				const { data } = await axios.post('/api/search', {
					query,
				});
				setPosts(data);
			} catch {
				setPosts([]);
			}
		};
		fetchSearch();
	}, [query]);

	return (
		<Layout currentUser={{ username: 'admin' }}>
			<>
				<Typography
					variant="h4"
					color="secondary"
					style={{ fontWeight: 'bold' }}
					gutterBottom
				>
					Pencarian - "{query}" {posts.length === 0 && ' tidak ditemukan'}
				</Typography>
				<Typography variant="subtitle2" color="textSecondary" gutterBottom>
					Menemukan {posts.length} hasil
				</Typography>
				{posts.map((post) => (
					<PostList
						key={post.id}
						title={post.title}
						voteCount={post.voteCount}
						tags={post.tags}
						createdBy={post.username}
						time={moment(post.updatedAt).fromNow()}
						postId={post.id}
					/>
				))}
			</>
		</Layout>
	);
};

export const getServerSideProps = async ({ query }) => {
	const { query: searchQuery } = query;

	return {
		props: {
			query: searchQuery,
		},
	};
};

export default Search;
