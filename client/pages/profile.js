import {
	Typography,
	Card,
	CardContent,
	FormGroup,
	FormControl,
	Button,
} from '@material-ui/core';
import { Formik, Form } from 'formik';
import axios from 'axios';
import useRequest from '../hooks/use-request';
import { useRouter } from 'next/router';

import Layout from '../components/Layout';
import TextInput from '../components/TextInput';

const Profile = ({ userData }) => {
	console.log(userData);
	const router = useRouter();

	const { doRequest } = useRequest({
		url: `/api/users/${userData.username}`,
		method: 'put',
		onSuccess: () => router.reload(),
	});

	return (
		<Layout currentUser="test">
			<>
				<Typography variant="h4" gutterBottom>
					Profile
				</Typography>
				<Card>
					<CardContent>
						<Formik
							initialValues={{
								email: userData.email,
								username: userData.username,
								password: '',
							}}
							onSubmit={async (values, { resetForm, setSubmitting }) => {
								console.log(values);
								values.password === '' && delete values.password;
								doRequest(values);
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
											label="New Password"
											name="password"
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
			</>
		</Layout>
	);
};

export const getServerSideProps = async ({ req }) => {
	const { data } = await axios.get(
		`${process.env.INGRESS_URI}/api/users/currentuser`,
		{
			headers: req.headers,
		}
	);

	return {
		props: {
			userData: data.currentUser,
		},
	};
};

export default Profile;
