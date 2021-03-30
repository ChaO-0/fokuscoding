import axios from 'axios';
import Layout from '../../components/Layout';
import renderToString from 'next-mdx-remote/render-to-string';
import hydrate from 'next-mdx-remote/hydrate';

const PostShow = ({ post, mdxContent }) => {
	console.log(post);
	const content = hydrate(mdxContent);
	return <Layout currentUser={{ username: 'admin' }}>{content}</Layout>;
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
