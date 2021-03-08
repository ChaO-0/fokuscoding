import Layout from '../../components/Layout';
import PostForm from '../../components/PostForm';

const CreatePost = () => {
	return (
		<Layout currentUser={{ username: 'pram' }}>
			<PostForm />
		</Layout>
	);
};

export default CreatePost;
