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
} from '@material-ui/core';
import { Editor, EditorState } from 'draft-js';

const PostForm = () => {
	const [editorState, setEditorState] = useState(() =>
		EditorState.createEmpty()
	);
	const [tags, setTags] = useState([]);

	const handleChange = (e) => {
		setTags(e.target.value);
	};

	const handleDelete = (e) => {
		console.log(e.target.key);
		setTags((tags) => tags.filter((tag) => tag.key !== e.key));
	};

	console.log(tags);

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
							<Select
								multiple
								value={tags}
								onChange={handleChange}
								renderValue={(selected) => (
									<>
										{selected.map((value) => (
											<Chip
												label={value}
												onDelete={handleDelete}
												onMouseDown={(e) => e.stopPropagation()}
											/>
										))}
									</>
								)}
							>
								<MenuItem value="test1">Test1</MenuItem>
								<MenuItem value="test2">Test2</MenuItem>
								<MenuItem value="test3">Test3</MenuItem>
							</Select>
						</FormControl>
					</FormGroup>
					{/* <Editor
						editorState={editorState}
						onChange={setEditorState}
						placeholder="test"
					/> */}
				</Form>
			</Formik>
		</>
	);
};

export default PostForm;
