import axios from 'axios';

const PostShow = ({ post }) => {
	console.log(post);
	return <h1>{post.body}</h1>;
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

	return {
		props: {
			post,
		},
	};
};
