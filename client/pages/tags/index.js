import React from 'react';
import Layout from '../../components/Layout';
import {
	Button,
	Box,
	Card,
	CardContent,
	CircularProgress,
	Grid,
	Typography,
} from '@material-ui/core';

import axios from 'axios';

import ShowMoreText from 'react-show-more-text';

const handleAccept = (tagId) => {
	console.log(tagId);
};

const tags = ({ tags }) => {
	let TagButton = null;
	if (true) {
		TagButton = ({ tagId }) => (
			<Box display="flex" justifyContent="flex-end">
				<Button
					onClick={() => handleAccept(tagId)}
					style={{ color: '#4CC9B0' }}
				>
					Accept
				</Button>
				<Button style={{ color: '#F6506C' }}>Reject</Button>
			</Box>
		);
	}

	return (
		<Layout>
			<>
				<Typography variant="h4" gutterBottom>
					Tags
				</Typography>
				<Grid container spacing={2} direction="row" justify="flex-start">
					{tags.map((tag) => (
						<Grid item xs={4} key={tag.name}>
							<Card>
								<CardContent>
									{tag.status === 'awaiting' && <TagButton tagId={tag.id} />}

									<Typography variant="h6" gutterBottom>
										{tag.name}
									</Typography>
									<ShowMoreText lines={3}>
										<Typography variant="body2" align="justify">
											{tag.description}
										</Typography>
									</ShowMoreText>
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			</>
		</Layout>
	);
};
export const getServerSideProps = async ({ req }) => {
	const { data } = await axios.get(`${process.env.INGRESS_URI}/api/tags`, {
		headers: req.headers,
	});

	return {
		props: {
			tags: data,
		},
	};
};
export default tags;
