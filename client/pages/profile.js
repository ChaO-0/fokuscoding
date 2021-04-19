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
import { useDispatch } from 'react-redux';

import Layout from '../components/Layout';
import TextInput from '../components/TextInput';
import Toast from '../components/Toast';
import { open } from '../redux/ducks/openload';

const Profile = ({ userData }) => {
	const dispatch = useDispatch();

	const { doRequest, errors } = useRequest({
		url: `/api/users/${userData.username}`,
		method: 'put',
		onSuccess: () =>
			setTimeout(() => {
				dispatch(open(false));
			}, 1000),
	});

	return (
		<Layout currentUser="test">
			<>
				<Typography variant="h4" gutterBottom>
					Profile
				</Typography>
				{errors ? (
					errors
				) : (
					<Toast severity="success">Update profile success</Toast>
				)}
				<Card>
					<CardContent>
						<Formik
							initialValues={{
								oldpass: '',
								newpass: '',
							}}
							onSubmit={async (values, { resetForm }) => {
								await doRequest(values);
								dispatch(open(true));
								resetForm();
							}}
						>
							<Form>
								<FormGroup style={{ width: '40%' }}>
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
