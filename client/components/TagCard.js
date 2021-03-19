import React from 'react';
import ShowMoreText from 'react-show-more-text';
import {
	Card,
	CardContent,
	Grid,
	Typography,
	Box,
	Button,
} from '@material-ui/core';
const TagCard = (props) => {
	const { tagName, tagDesc } = props;
	return (
		<Grid item xs={4}>
			<Card>
				<CardContent>
					{props.children}
					<Typography variant="h6" gutterBottom>
						{tagName}
					</Typography>
					<ShowMoreText lines={3}>
						<Typography variant="body2" align="justify">
							{tagDesc}
						</Typography>
					</ShowMoreText>
				</CardContent>
			</Card>
		</Grid>
	);
};

export default TagCard;
