import Layout from '../../components/Layout';

const ShowUsers = () => {
	return (
		<Layout currentUser={{ username: 'admin' }}>
			<h1>This is user list</h1>
		</Layout>
	);
};

export default ShowUsers;
