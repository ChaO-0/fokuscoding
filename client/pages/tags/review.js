import { useState } from 'react';
import Layout from '../../components/Layout';
import {
	Button,
	Box,
	Typography,
	Grid,
	Select,
	MenuItem,
	InputLabel,
} from '@material-ui/core';

import axios from 'axios';
import TagCard from '../../components/TagCard';

import { useDispatch } from 'react-redux';
import { open } from '../../redux/ducks/openload';
import Toast from '../../components/Toast';
import MyDialogBox from '../../components/MyDialogBox';

const handleRequest = async (url, method) => {
	try {
		await axios[method](url);
	} catch (err) {
		console.log(err);
	}
};

const review = ({ tags }) => {
	const [listTags, setListTags] = useState(tags);
	const [tagStatus, setTagStatus] = useState('awaiting');
	const dispatch = useDispatch();

	const handleRemove = (tagId) => {
		const newTagList = listTags.filter((tag) => tag.id !== tagId);

		setListTags(newTagList);
	};
	const handleAccept = async (tagId) => {
		await handleRequest(`/api/tags/${tagId}/accept`, 'post');
		handleRemove(tagId);
		dispatch(open(true));
	};

	const handleRejectDelete = async (tagId) => {
		await handleRequest(`/api/tags/${tagId}`, 'delete');
		handleRemove(tagId);
		dispatch(open(true));
	};

	const handleChange = async (e) => {
		setTagStatus(e.target.value);
		const { data } = await axios.get(
			`/api/tags/review?status=${e.target.value}`
		);
		setListTags(data);
	};

	const handleActivation = async (tagId) => {
		await handleRequest(`/api/tags/${tagId}`, 'put');
		const tagIndex = listTags.findIndex((elm) => elm.id === tagId);
		setListTags((prev) => {
			prev[tagIndex].is_active = !prev[tagIndex].is_active;
			return [...prev];
		});
	};

	const TagButton = ({ tagId, userName, active }) => (
		<>
			<Box display="flex" justifyContent="flex-end">
				<Box fontStyle="italic" display="flex" flexGrow={1} alignItems="center">
					<Typography variant="caption" color="textSecondary">
						Oleh: {userName}
					</Typography>
				</Box>
				{
					tagStatus === 'awaiting' ? (
						<>
							<MyDialogBox
								buttonText="Accept"
								buttonColor="#4CC9B0"
								dialogTitle="Accept Tags"
								dialogText="Kamu yakin ingin accept tag ini?"
								acceptText="Accept"
								request={() => handleAccept(tagId)}
							/>
							<MyDialogBox
								buttonText="Reject"
								buttonColor="#F6506C"
								dialogTitle="Reject Tags"
								dialogText="Kamu yakin ingin reject tag ini?"
								acceptText="Reject"
								request={() => handleRejectDelete(tagId)}
							/>
						</>
					) : null
					// (
					// 	<>
					// 		<Button
					// 			onClick={() => handleRejectDelete(tagId)}
					// 			style={{ color: '#F6506C' }}
					// 		>
					// 			Delete
					// 		</Button>
					// 	</>
					// )
				}
				{tagStatus === 'accepted' && active ? (
					<MyDialogBox
						buttonText="Deactivate"
						buttonColor="#F6506C"
						dialogTitle="Deactivate Tags"
						dialogText="Kamu yakin ingin non-aktifkan tag ini?"
						acceptText="Deactivate"
						request={() => handleActivation(tagId)}
					/>
				) : (
					tagStatus === 'accepted' &&
					!active && (
						<MyDialogBox
							buttonText="Activate"
							buttonColor="#4CC9B0"
							dialogTitle="Activate Tags"
							dialogText="Kamu yakin ingin aktifkan tag ini?"
							acceptText="Activate"
							request={() => handleActivation(tagId)}
						/>
					)
				)}
			</Box>
		</>
	);
	return (
		<Layout>
			<>
				<Toast severity="success">Success</Toast>

				<Typography variant="h4" gutterBottom>
					Tags Review
				</Typography>

				<Box width="25%" mb={2}>
					<InputLabel>Tag Status</InputLabel>
					<Select onChange={handleChange} fullWidth value={tagStatus}>
						<MenuItem value={'awaiting'}>Awaiting</MenuItem>
						<MenuItem value={'accepted'}>Accepted</MenuItem>
						<MenuItem value={'rejected'}>Rejected</MenuItem>
					</Select>
				</Box>
				<Grid container spacing={2} direction="row" justify="flex-start">
					{listTags.map((tag) => (
						<TagCard
							key={tag.id}
							tagId={tag.id}
							tagName={tag.name}
							tagDesc={tag.description}
						>
							<TagButton
								tagId={tag.id}
								userName={tag.username}
								active={tag.is_active}
							/>
						</TagCard>
					))}
				</Grid>
			</>
		</Layout>
	);
};

export const getServerSideProps = async ({ req }) => {
	const getTags = async () => {
		try {
			const { data } = await axios.get(
				`${process.env.INGRESS_URI}/api/tags/review`,
				{
					headers: req.headers,
				}
			);
			return data;
		} catch {
			return [];
		}
	};

	const data = await getTags();

	console.log(data);

	return {
		props: {
			tags: data,
		},
	};
};
export default review;
