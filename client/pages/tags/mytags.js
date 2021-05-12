import React from 'react';
import Layout from '../../components/Layout';
import { Box, Typography, Grid } from '@material-ui/core';

import axios from 'axios';
import TagCard from '../../components/TagCard';

const myTags = ({ tags }) => {
	return (
		<Layout>
			<>
				<Typography variant="h4" gutterBottom>
					My Tags
				</Typography>
				<Grid container spacing={2} direction="row" justify="flex-start">
					{tags.map((tag) => (
						<TagCard
							key={tag.id}
							tagId={tag.id}
							tagName={tag.name}
							tagDesc={tag.description}
							hasLink={tag.status === 'accepted'}
						>
							<Box
								display="flex"
								flexGrow={1}
								alignItems="center"
								justifyContent="flex-end"
							>
								<Typography
									variant="button"
									style={
										tag.status === 'rejected'
											? { color: '#F6506C' }
											: tag.status === 'awaiting'
											? { color: '#4C72C9' }
											: { color: '#4CC9B0' }
									}
								>
									{tag.status}
								</Typography>
							</Box>
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
				`${process.env.INGRESS_URI}/api/tags/userTag`,
				{
					headers: req.headers,
				}
			);
			return data;
		} catch {
			return [];
		}
	};
	// const { data } = await axios.get(
	// 	`${process.env.INGRESS_URI}/api/tags/userTag`,
	// 	{
	// 		headers: req.headers,
	// 	}
	// );

	const data = await getTags();

	return {
		props: {
			tags: data,
		},
	};
};
export default myTags;
