import Layout from '../../../components/Layout';
import PostForm from '../../../components/PostForm';
import axios from 'axios';

const UpdatePost = ({ tags, post }) => {
	return (
		<Layout>
			<>
				<h1>Test</h1>
				<PostForm tags={tags} postValue={post} editForm />
			</>
		</Layout>
	);
};

export const getServerSideProps = async ({ req, query }) => {
	const { data } = await axios.get(`${process.env.INGRESS_URI}/api/tags`, {
		headers: req.headers,
	});

	data.forEach((elm) => {
		delete elm.description;
		delete elm.status;
		delete elm.version;
		delete elm.username;
	});

	const { postId } = query;

	const { data: post } = await axios.get(
		`${process.env.INGRESS_URI}/api/posts/${postId}`,
		{
			headers: req.headers,
		}
	);

	console.log(post);

	return {
		props: {
			tags: data,
			post,
		},
	};
};

export default UpdatePost;
