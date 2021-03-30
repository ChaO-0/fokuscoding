import axios from 'axios';
import Layout from '../../components/Layout';
import renderToString from 'next-mdx-remote/render-to-string';
import hydrate from 'next-mdx-remote/hydrate';
import { Card, CardContent, Box, Typography, Chip } from '@material-ui/core';

const PostShow = ({ post, mdxContent }) => {
	console.log(post);
	const content = hydrate(mdxContent);
	return (
		<Layout currentUser={{ username: 'admin' }}>
			<Card>
				<CardContent>
					<Box display="flex" flexDirection="row" justifyContent="flex-start">
						<Box flexDirection="column" marginRight={3}>
							<Typography variant="h5" color="secondary" align="center">
								<Box fontWeight={600}>{0}</Box>
							</Typography>
							<Typography
								color="secondary"
								component="div"
								style={{ fontSize: 12 }}
								align="center"
							>
								<Box fontWeight={600} my="auto">
									VOTE
								</Box>
							</Typography>
						</Box>
						<Box flexDirection="row">
							<Box>
								{post.tags.map((tag) => (
									<Chip
										label={tag.name}
										key={tag.id}
										style={{
											backgroundColor: '#4CC9B040',
											color: '#4CC9B0',
											borderRadius: 0,
											margin: '0 3',
										}}
									/>
								))}
							</Box>
							<Typography variant="h4">{post.title}</Typography>
						</Box>
					</Box>
				</CardContent>
			</Card>
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
