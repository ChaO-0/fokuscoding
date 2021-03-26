import { Typography, Card, CardContent } from '@material-ui/core';
import Layout from '../components/Layout';

const Profile = () => {
	return (
		<Layout currentUser="test">
			<Typography variant="h4" gutterBottom>
				Profile
			</Typography>
			<Card>
				<CardContent>
					<Typography variant="h6" gutterBottom>
						test
					</Typography>
				</CardContent>
			</Card>
		</Layout>
	);
};

export default Profile;
