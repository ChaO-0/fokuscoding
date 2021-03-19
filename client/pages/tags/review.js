import React from 'react';
import Layout from '../../components/Layout';
import { Button, Box, Typography, Grid } from '@material-ui/core';

import axios from 'axios';
import TagCard from '../../components/TagCard';
const review = ({ tags }) => {
	const TagButton = ({ tagId, userName }) => (
		<>
			<Box display="flex" justifyContent="flex-end">
				<Box fontStyle="italic" display="flex" flexGrow={1} alignItems="center">
					<Typography variant="caption" color="textSecondary">
						Oleh: {userName}
					</Typography>
				</Box>
				<Button style={{ color: '#4CC9B0' }}>Accept</Button>
				<Button style={{ color: '#F6506C' }}>Reject</Button>
			</Box>
		</>
	);
	return (
		<Layout>
			<>
				<Typography variant="h4" gutterBottom>
					Tags Review
				</Typography>
				<Grid container spacing={2} direction="row" justify="flex-start">
					{tags.map((tag) => (
						<TagCard
							key={tag.id}
							tagId={tag.id}
							tagName={tag.name}
							tagDesc={tag.description}
						>
							<TagButton tagId={tag.id} userName={tag.username} />
						</TagCard>
					))}
				</Grid>
			</>
		</Layout>
	);
};

export const getServerSideProps = async ({ req }) => {
	const { data } = await axios.get(
		`${process.env.INGRESS_URI}/api/tags/review`,
		{
			headers: req.headers,
		}
	);

	return {
		props: {
			tags: data,
		},
	};
};
export default review;
