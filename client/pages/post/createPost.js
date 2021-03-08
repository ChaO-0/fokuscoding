import Layout from '../../components/Layout';
import PostForm from '../../components/PostForm';

const createPost = () => {
	return (
		<Layout currentUser={{ username: 'fajar' }}>
			<PostForm />
		</Layout>
	);
};

export default createPost;
