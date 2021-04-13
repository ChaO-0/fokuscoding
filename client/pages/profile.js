import {
	Typography,
	Card,
	CardContent,
	FormGroup,
	FormControl,
	Button,
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
							<FormGroup style={{ width: '40%' }}>
								<FormControl>
									<TextInput label="Email" name="email" type="email" />
								</FormControl>
								<FormControl style={{ marginTop: '10px' }}>
									<TextInput label="Username" name="username" />
								</FormControl>
								<FormControl style={{ marginTop: '10px' }}>
									<TextInput
										label="Old Password"
										name="oldpass"
										type="password"
									/>
								</FormControl>
								<FormControl style={{ marginTop: '10px' }}>
									<TextInput
										label="New Password"
										name="newpass"
										type="password"
									/>
								</FormControl>
								<Button
									variant="contained"
									color="secondary"
									type="submit"
									style={{
										color: 'white',
										marginTop: '10px',
										fontWeight: 'bold',
										width: '30%',
									}}
								>
									Update
								</Button>
							</FormGroup>
						</Form>
					</Formik>
				</CardContent>
			</Card>
		</Layout>
	);
};

export default Profile;
