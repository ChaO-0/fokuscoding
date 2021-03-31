import axios from 'axios';
import Layout from '../../components/Layout';
import renderToString from 'next-mdx-remote/render-to-string';
import hydrate from 'next-mdx-remote/hydrate';
import {
	Card,
	CardContent,
	Box,
	Typography,
	Chip,
	Button,
} from '@material-ui/core';
import {
	ExpandLess as ExpandLessIcon,
	ExpandMore as ExpandMoreIcon,
} from '@material-ui/icons';
import moment from 'moment';
import dynamic from 'next/dynamic';
import PostDetail from '../../components/PostDetail';

const SimpleMDE = dynamic(() => import('../../components/SimpleMDE'), {
	ssr: false,
});

const PostShow = ({ post, mdxContent }) => {
	console.log(post);
	const content = hydrate(mdxContent);
	console.log(mdxContent);
	return (
		<Layout currentUser={{ username: 'admin' }}>
			<>
				<PostDetail post={post} content={content} />
				<Box mt={3}>
					<Typography variant="h4" color="secondary">
						0 Jawaban
					</Typography>
					<hr />
					<Card>
						<CardContent>test</CardContent>
					</Card>
				</Box>
				<Box mt={3}>
					<Typography variant="h4" color="secondary">
						Bantu menjawab
					</Typography>
					<hr />
					<SimpleMDE />
					<Button
						variant="contained"
						color="secondary"
						type="submit"
						style={{ color: 'white', width: '100%' }}
					>
						Submit
					</Button>
				</Box>
			</>
		</Layout>
	);
};

export default PostShow;

export const getServerSideProps = async ({ req, query }) => {
	const postId = query.postId;

	const { data: post } = await axios.get(
		`${process.env.INGRESS_URI}/api/posts/${postId}`,
		{
			headers: req.headers,
		}
	);

	const mdxContent = await renderToString(post.body);

	return {
		props: {
			post,
			mdxContent,
		},
	};
};
