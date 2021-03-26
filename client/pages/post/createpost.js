import Layout from '../../components/Layout';
import PostForm from '../../components/PostForm';
import axios from 'axios';

const CreatePost = ({ tags }) => {
	console.log(tags);
	return (
		<Layout currentUser={{ username: 'pram' }}>
			<PostForm tags={tags} />
		</Layout>
	);
};

export const getServerSideProps = async ({ req }) => {
	const { data } = await axios.get(`${process.env.INGRESS_URI}/api/tags`, {
		headers: req.headers,
	});

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
