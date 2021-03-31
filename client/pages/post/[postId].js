import axios from 'axios';
import Layout from '../../components/Layout';
import renderToString from 'next-mdx-remote/render-to-string';
import hydrate from 'next-mdx-remote/hydrate';
import { Card, CardContent, Box, Typography, Chip } from '@material-ui/core';
import {
	ExpandLess as ExpandLessIcon,
	ExpandMore as ExpandMoreIcon,
} from '@material-ui/icons';
import moment from 'moment';

const PostShow = ({ post, mdxContent }) => {
	console.log(post);
	const content = hydrate(mdxContent);
	console.log(mdxContent);
	return (
		<Layout currentUser={{ username: 'admin' }}>
			<>
				<Card>
					<CardContent>
						<Box display="flex" flexDirection="row" justifyContent="flex-start">
							<Box flexDirection="column" marginRight={3}>
								<ExpandLessIcon style={{ marginLeft: 3 }} />
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
								<ExpandMoreIcon style={{ marginLeft: 3 }} />
							</Box>
							<Box flexDirection="row" style={{ width: '100%' }}>
								<Box
									flexDirection="row"
									style={{
										borderBottom: '3px solid #707070',
										width: '80%',
										paddingBottom: 10,
									}}
								>
									<Box>
										{post.tags.map((tag) => (
											<Chip
												label={tag.name}
												key={tag.id}
												style={{
													backgroundColor: '#4CC9B040',
													color: '#4CC9B0',
													borderRadius: 0,
													margin: '0 3px',
												}}
											/>
										))}
									</Box>
									<Typography variant="h4">{post.title}</Typography>
									<Box flexDirection="column">
										<Typography
											variant="caption"
											style={{
												marginRight: 50,
												color: '#707070',
												fontStyle: 'italic',
											}}
										>
											Dibuat tanggal:{' '}
											{moment(new Date(post.createdAt)).format('DD-MM-YYYY')}
										</Typography>
										<Typography
											variant="caption"
											style={{ color: '#707070', fontStyle: 'italic' }}
										>
											Terakhir diperbarui:{' '}
											{moment(new Date(post.updatedAt)).format('DD-MM-YYYY')}
										</Typography>
									</Box>
									<Typography
										variant="caption"
										style={{
											color: '#707070',
											fontStyle: 'italic',
										}}
									>
										Oleh: {post.username}
									</Typography>
								</Box>
								<Box mt={3} style={{ width: '80%' }}>
									{content}
								</Box>
							</Box>
						</Box>
					</CardContent>
				</Card>
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
					<Card>
						<CardContent>test</CardContent>
					</Card>
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
