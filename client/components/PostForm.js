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
} from '@material-ui/core';
import dynamic from 'next/dynamic';

const SimpleMDE = dynamic(() => import('./SimpleMDE'), { ssr: false });

const PostForm = () => {
	const [tags, setTags] = useState([]);
	const handleChange = (e) => {
		setTags(e.target.value);
	};

	const handleDelete = (tagToDelete) => {
		setTags((tags) => tags.filter((tag) => tag !== tagToDelete));
	};

	return (
		<>
			<Formik>
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
								>
									<MenuItem value="test1">Test1</MenuItem>
									<MenuItem value="test2">Test2</MenuItem>
									<MenuItem value="test3">Test3</MenuItem>
								</Select>
								{tags.map((tag) => {
									console.log(tag);
									return (
										<Chip
											key={tag}
											label={tag}
											onDelete={() => handleDelete(tag)}
										/>
									);
								})}
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
