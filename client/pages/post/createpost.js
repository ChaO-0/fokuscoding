import Layout from '../../components/Layout';
import PostForm from '../../components/PostForm';
import axios from 'axios';

const CreatePost = ({ tags }) => {
	return (
		<Layout>
			<PostForm tags={tags} />
		</Layout>
	);
};

export const getServerSideProps = async ({ req }) => {
	const getPosts = async () => {
		try {
			const { data } = await axios.get(`${process.env.INGRESS_URI}/api/tags`, {
				headers: req.headers,
			});

			return data;
		} catch {
			return [];
		}
	};

	// const { data } = await axios.get(`${process.env.INGRESS_URI}/api/tags`, {
	// 	headers: req.headers,
	// });

	const data = await getPosts();

	data.forEach((elm) => {
		delete elm.description;
		delete elm.status;
		delete elm.version;
		delete elm.username;
	});

	return {
		props: {
			tags: data,
		},
	};
};

export default CreatePost;
