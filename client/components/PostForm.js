import TextInput from './TextInput';
import { Form, Formik, FieldArray } from 'formik';
import {
	FormGroup,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Chip,
	Box,
	Button,
	FormHelperText,
	TextField,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import * as Yup from 'yup';
import dynamic from 'next/dynamic';
import { Autocomplete } from '@material-ui/lab';
import useRequest from '../hooks/use-request';
import { useRouter } from 'next/router';

const SimpleMDE = dynamic(() => import('./SimpleMDE'), { ssr: false });

const CustomAutocomplete = withStyles({
	tag: {
		backgroundColor: '#4CC9B040',
		color: '#4CC9B0',
		borderRadius: 0,
		height: 30,
		position: 'relative',
		zIndex: 0,
		'& .MuiChip-label': {
			color: '#3e9987',
		},
		'& .MuiChip-deleteIcon': {
			color: '#656565',
		},
	},
})(Autocomplete);

const PostForm = ({ tags: tagsList }) => {
	const validationSchema = Yup.object({
		title: Yup.string('Enter your Title').required('Title is required'),
	});

	const router = useRouter();

	const { doRequest, errors } = useRequest({
		url: '/api/posts',
		method: 'post',
		onSuccess: () => router.push('/home'),
	});

	return (
		<>
			<Formik
				validationSchema={validationSchema}
				initialValues={{ title: '', tags: [], body: '' }}
				onSubmit={(values) => {
					console.log(values);
					doRequest(values);
				}}
			>
				{({ setFieldValue }) => (
					<Form>
						<FormGroup>
							<FormControl>
								<TextInput label="Title" name="title" />
							</FormControl>
							<FormControl margin="normal">
								<InputLabel shrink htmlFor="tags">
									Tags
								</InputLabel>

								<CustomAutocomplete
									multiple
									options={tagsList}
									getOptionLabel={(option) => option.name}
									noOptionsText="Tidak Ditemukan"
									onChange={(e, value) => {
										const ids = value.map((val) => val.id);
										setFieldValue('tags', ids);
									}}
									renderInput={(params) => (
										<TextField
											{...params}
											variant="outlined"
											style={{
												marginTop: 20,
												backgroundColor: '#00000012',
												borderRadius: 4,
												height: '100%',
												outline: 'none',
											}}
											name="tags"
										/>
									)}
								/>
							</FormControl>
							<FormControl style={{ marginTop: 30 }}>
								<InputLabel shrink htmlFor="editor">
									Share your problem
								</InputLabel>
								<Box mt={3}>
									<SimpleMDE
										onChange={(value) => setFieldValue('body', value)}
										name="body"
									/>
								</Box>
							</FormControl>
							<Button
								variant="contained"
								color="secondary"
								style={{ color: 'white' }}
								type="submit"
							>
								Submit
							</Button>
						</FormGroup>
					</Form>
				)}
			</Formik>
		</>
	);
};

export default PostForm;
