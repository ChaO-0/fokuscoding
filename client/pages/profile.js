import {
	Typography,
	Card,
	CardContent,
	FormGroup,
	FormControl,
} from '@material-ui/core';
import { Formik, Form } from 'formik';

import Layout from '../components/Layout';
import TextInput from '../components/TextInput';

const Profile = () => {
	return (
		<Layout currentUser="test">
			<Typography variant="h4" gutterBottom>
				Profile
			</Typography>
			<Card>
				<CardContent>
					<Formik
						initialValues={{ email: '', password: '' }}
						onSubmit={async (values, { resetForm, setSubmitting }) => {
							console.log('test');
						}}
					>
						<Form>
							<FormGroup>
								<FormControl>
									<TextInput label="Email" name="email" />
								</FormControl>
								<FormControl>
									<TextInput label="Password" name="password" type="password" />
								</FormControl>
							</FormGroup>
						</Form>
					</Formik>
				</CardContent>
			</Card>
		</Layout>
	);
};

export default Profile;
