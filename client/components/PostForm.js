import { useState } from 'react';
import TextInput from './TextInput';
import { Form, Formik } from 'formik';
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
} from '@material-ui/core';
import * as Yup from 'yup';
import dynamic from 'next/dynamic';

const SimpleMDE = dynamic(() => import('./SimpleMDE'), { ssr: false });

const PostForm = (props) => {
	const [tags, setTags] = useState([]);
	const handleChange = (e) => {
		setTags(e.target.value);
	};

	const handleDelete = (tagToDelete) => {
		setTags((tags) => tags.filter((tag) => tag !== tagToDelete));
	};

	const validationSchema = Yup.object({
		title: Yup.string('Enter your Title').required('Title is required'),
		tags: Yup.string('Enter your password').required('Tag is required'),
	});

	return (
		<>
			<Formik validationSchema={validationSchema}>
				<Form>
					<FormGroup>
						<FormControl>
							<TextInput label="Title" name="title" />
						</FormControl>
						<FormControl style={{ marginTop: 30 }}>
							<InputLabel shrink htmlFor="tags">
								Tags
							</InputLabel>
							<Box>
								<Select
									multiple
									value={tags}
									onChange={handleChange}
									variant="outlined"
									style={{
										width: '50%',
										marginTop: 20,
										backgroundColor: '#00000012',
										borderRadius: 4,
										height: 40,
										outline: 'none',
									}}
									name="tags"
								>
									{props.tags.map((tag) => (
										<MenuItem key={tag.id} value={tag}>
											{tag.name}
										</MenuItem>
									))}
								</Select>
								{tags.map((tag) => {
									return (
										<Chip
											key={tag.id}
											label={tag.name}
											onDelete={() => handleDelete(tag)}
										/>
									);
								})}
								<FormHelperText>Error</FormHelperText>
							</Box>
						</FormControl>
						<FormControl style={{ marginTop: 30 }}>
							<InputLabel shrink htmlFor="editor">
								Share your problem
							</InputLabel>
							<Box mt={3}>
								<SimpleMDE />
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
			</Formik>
		</>
	);
};

export default PostForm;
