import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import renderToString from 'next-mdx-remote/render-to-string';
import hydrate from 'next-mdx-remote/hydrate';
import {
	Box,
	Typography,
	Button,
	FormControl,
	InputLabel,
	FormHelperText,
} from '@material-ui/core';
import { Form, Formik, useField } from 'formik';

import Layout from '../../components/Layout';
import PostDetail from '../../components/PostDetail';
import useRequest from '../../hooks/use-request';
import CommentList from '../../components/CommentList';
import * as Yup from 'yup';

const SimpleMDE = dynamic(() => import('../../components/SimpleMDE'), {
	ssr: false,
});

const SimpleMdeFormik = ({ onChange, onBlur, ...props }) => {
	const [field, meta] = useField(props);
	const margin = meta.touched && meta.error ? 0 : 2;
	return (
		<>
			<Box mb={margin}>
				<Box display="flex" justifyContent="flex-end">
					{meta.touched && meta.error ? (
						<FormHelperText
							style={{
								color: '#FF0D39',
								margin: 0,
							}}
						>
							{meta.error}
						</FormHelperText>
					) : null}
				</Box>
			</Box>
			<Box
				style={
					meta.touched && meta.error
						? {
								border: '1px solid #FF0D39',
								borderRadius: '4px',
								marginBottom: '15px',
						  }
						: null
				}
			>
				<SimpleMDE {...props} onChange={onChange} onBlur={onBlur} />
			</Box>
		</>
	);
};

const validationSchema = Yup.object({
	text: Yup.string().required('Tulis komentar anda!'),
});

const PostShow = ({ post, mdxContent, comments }) => {
	const router = useRouter();
	const [hasSolution, setHasSolution] = useState(post.has_solution);
	const { postId } = router.query;
	const { doRequest } = useRequest({
		url: `/api/posts/${postId}`,
		method: 'post',
		onSuccess: () => router.reload(),
	});

	const content = hydrate(mdxContent);
	const hydratedComment = [];

	comments.forEach((elm) => {
		hydratedComment.push(hydrate(elm));
	});

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
						console.log(post.has_solution);
						return (
							<CommentList
								key={comment.id}
								comment={comment}
								postId={post.id}
								postUsername={post.username}
								solution={post.solution?.id === comment.id}
								hasSolution={hasSolution}
								setHasSolution={setHasSolution}
							>
								{hydratedComment[idx]}
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
						validationSchema={validationSchema}
						initialValues={{ text: '' }}
						onSubmit={(values) => {
							doRequest(values);
						}}
					>
						{({ setFieldValue, setFieldTouched }) => (
							<Form>
								<SimpleMdeFormik
									name="text"
									onChange={(value) => setFieldValue('text', value)}
									onBlur={() => {
										setFieldTouched('text', true, true);
									}}
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

	// console.log(post);

	return {
		props: {
			post,
			mdxContent,
			comments,
		},
	};
};
