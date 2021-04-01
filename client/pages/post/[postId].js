import axios from 'axios';
import Layout from '../../components/Layout';
import renderToString from 'next-mdx-remote/render-to-string';
import hydrate from 'next-mdx-remote/hydrate';
import { Card, CardContent, Box, Typography, Button } from '@material-ui/core';
import dynamic from 'next/dynamic';
import PostDetail from '../../components/PostDetail';
import { Form, Formik } from 'formik';
import useRequest from '../../hooks/use-request';
import { useRouter } from 'next/router';
import {
	ExpandLess as ExpandLessIcon,
	ExpandMore as ExpandMoreIcon,
} from '@material-ui/icons';
import CommentList from '../../components/CommentList';
import { useState } from 'react';

const SimpleMDE = dynamic(() => import('../../components/SimpleMDE'), {
	ssr: false,
});

const PostShow = ({ post, mdxContent, comments }) => {
	// const [postComments, setPostComments] = useState([...comments]);

	// console.log(postComments);

	const router = useRouter();
	const { postId } = router.query;
	const { doRequest } = useRequest({
		url: `/api/posts/${postId}`,
		method: 'post',
		onSuccess: () => router.push(`/post/${postId}`),
	});

	const content = hydrate(mdxContent);
	const test = [];

	comments.map((elm) => {
		test.push(hydrate(elm));
	});

	// const test_ = post.comments.map((comment, idx) => {
	// 	return { ...comment, mdxed: test[idx] };
	// });

	return (
		<Layout currentUser={{ username: 'admin' }}>
			<>
				<PostDetail post={post} content={content} />
				<Box mt={3}>
					<Typography variant="h4" color="secondary">
						{post.comments.length} Jawaban
					</Typography>
					<hr />
					{post.comments.map((comment, idx) => {
						return (
							<CommentList key={comment.id} comment={comment}>
								{test[idx]}
							</CommentList>
						);
					})}
				</Box>
				<Box mt={3}>
					<Typography variant="h4" color="secondary">
						Bantu menjawab
					</Typography>
					<hr />
					<Formik
						initialValues={{ text: '' }}
						onSubmit={(values) => {
							console.log(values);
							doRequest(values);
						}}
					>
						{({ setFieldValue }) => (
							<Form>
								<SimpleMDE
									name="text"
									onChange={(value) => setFieldValue('text', value)}
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
	const comments = [];

	for (const comment of post.comments) {
		comments.push(await renderToString(comment.text));
	}

	console.log(comments);

	return {
		props: {
			post,
			mdxContent,
			comments,
		},
	};
};
