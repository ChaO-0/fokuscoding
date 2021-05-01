import Layout from '../../components/Layout';
import { Box, Typography, Grid } from '@material-ui/core';

import axios from 'axios';
import TagCard from '../../components/TagCard';

const tags = ({ tags }) => {
	return (
		<Layout>
			<>
				<Typography variant="h4" gutterBottom>
					Tags
				</Typography>
				<Grid container spacing={2} direction="row" justify="flex-start">
					{tags.map((tag) => (
						<TagCard
							key={tag.id}
							tagId={tag.id}
							tagName={tag.name}
							tagDesc={tag.description}
						>
							<Box display="flex" justifyContent="flex-end">
								<Box
									fontStyle="italic"
									display="flex"
									flexGrow={1}
									alignItems="center"
								>
									<Typography variant="caption" color="textSecondary">
										Oleh: {tag.username}
									</Typography>
								</Box>
								<Typography>{tag.posts.length}</Typography>
							</Box>
						</TagCard>
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
