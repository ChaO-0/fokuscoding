import TextInput from './TextInput';
import { Form, Formik, ErrorMessage, useField } from 'formik';
import {
	FormGroup,
	FormControl,
	InputLabel,
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

const SimpleMdeFormik = ({ onChange, onBlur, ...props }) => {
	const [field, meta] = useField(props);
	const margin = meta.touched && meta.error ? 0 : 2;
	return (
		<>
			<Box mb={margin}>
				<Box display="flex">
					<InputLabel shrink htmlFor="editor">
						Share your problem
					</InputLabel>
				</Box>
				<Box display="flex" justifyContent="flex-end">
					{meta.touched && meta.error ? (
						<FormHelperText
							style={{
								color: '#FF0D39',
								margin: 0,
							}}
						>
							{meta.error}
						</FormHelperText>
					) : null}
				</Box>
			</Box>
			<Box
				style={
					meta.touched && meta.error
						? {
								border: '1px solid #FF0D39',
								borderRadius: '4px',
								marginBottom: '15px',
						  }
						: null
				}
			>
				<SimpleMDE {...props} onChange={onChange} onBlur={onBlur} />
			</Box>
		</>
	);
};

const PostForm = ({ tags: tagsList, postValue, editForm }) => {
	const validationSchema = Yup.object({
		title: Yup.string('Enter your Title').required('Title is required'),
		tags: Yup.array().min(1, 'Masukkan setidaknya 1 Tag!'),
		body: Yup.string('Enter your body').required('Tulis masalah anda!'),
	});

	const router = useRouter();

	const { doRequest, errors } = useRequest({
		url: editForm ? `/api/posts/${postValue.id}` : '/api/posts',
		method: editForm ? 'put' : 'post',
		onSuccess: () => router.push('/post/mypost'),
	});

	return (
		<>
			<Formik
				validationSchema={validationSchema}
				initialValues={{
					title: postValue ? postValue.title : '',
					tags: postValue ? postValue.tags : [],
					body: postValue ? postValue.body : '',
				}}
				onSubmit={(values) => {
					const tagIds = values.tags.map((tag) => tag.id);
					values = { ...values, tags: tagIds };
					console.log(values);
					doRequest(values);
				}}
			>
				{({ setFieldValue, setFieldTouched, values }) => (
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
									value={values.tags}
									getOptionSelected={(option, value) => option.id === value.id}
									options={tagsList}
									getOptionLabel={(option) => option.name}
									noOptionsText={`Tidak Ditemukan? Buat tag baru dengan klik menu "Buat Tag" `}
									onChange={(e, value) => {
										setFieldValue('tags', value);
									}}
									onBlur={() => {
										setFieldTouched('tags', true, true);
									}}
									name="tags"
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
								<FormHelperText style={{ color: '#FF0D39' }}>
									<ErrorMessage name="tags" />
								</FormHelperText>
							</FormControl>
							<FormControl margin="normal">
								<SimpleMdeFormik
									value={values.body}
									name="body"
									onChange={(value) => setFieldValue('body', value)}
									onBlur={() => {
										setFieldTouched('body', true, true);
									}}
								/>
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
