import axios from 'axios';
import Layout from '../../components/Layout';
import renderToString from 'next-mdx-remote/render-to-string';
import hydrate from 'next-mdx-remote/hydrate';
import { Card, CardContent, Box, Typography, Button } from '@material-ui/core';
import dynamic from 'next/dynamic';
import PostDetail from '../../components/PostDetail';
import { Form, Formik } from 'formik';

const SimpleMDE = dynamic(() => import('../../components/SimpleMDE'), {
	ssr: false,
});

const PostShow = ({ post, mdxContent }) => {
	// console.log(post);
	const content = hydrate(mdxContent);
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
					<Formik
						initialValues={{ body: '' }}
						onSubmit={(values) => {
							console.log('test');
							console.log(values);
						}}
					>
						{({ setFieldValue }) => (
							<Form>
								<SimpleMDE
									name="body"
									onChange={(value) => setFieldValue('body', value)}
								/>
								<Button
									variant="contained"
									color="secondary"
									type="submit"
									style={{ color: 'white', width: '100%' }}
								>
									Submit
								</Button>
							</Form>
						)}
					</Formik>
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
