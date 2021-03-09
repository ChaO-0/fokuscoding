import Layout from '../../components/Layout';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import TextInput from '../../components/TextInput';
import {
	FormGroup,
	FormControl,
	Box,
	Button,
	Card,
	CardContent,
} from '@material-ui/core';

import useRequest from '../../hooks/use-request';
import MyButton from '../../components/MyButton';

const createPost = () => {
	const validationSchema = yup.object({
		tags: yup.string().required('Tags name is required'),
		description: yup.string().required('Description is required'),
	});
	const { doRequest } = useRequest({
		url: '/api/tags',
		method: 'post',
	});
	return (
		<Layout currentUser={{ username: 'fajar' }}>
			<Card style={{ width: '80%', margin: 'auto' }}>
				<CardContent>
					<h1>Buat sebuah Tags</h1>
					<Formik
						initialValues={{ tags: '', description: '' }}
						validationSchema={validationSchema}
						onSubmit={async (values, { resetForm, setSubmitting }) => {
							setSubmitting(false);
							await doRequest(values);
							resetForm({});
						}}
					>
						<Form>
							<FormGroup>
								<FormControl margin={'dense'}>
									<TextInput label="Tags" name="tags" type="text" />
								</FormControl>
								<FormControl margin={'dense'}>
									<TextInput
										label="Description"
										name="description"
										type="text"
										multiline={true}
										rows={5}
										rowsMax={10}
									/>
								</FormControl>
								<Box ml="auto" mt={1}>
									<MyButton>
										<>Submit</>
									</MyButton>
								</Box>
							</FormGroup>
						</Form>
					</Formik>
				</CardContent>
			</Card>
		</Layout>
	);
};

export default createPost;
