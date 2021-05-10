import React from 'react';
import ShowMoreText from 'react-show-more-text';
import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import NextLink from 'next/link';

const TagCard = (props) => {
	const { tagName, tagDesc, hasLink } = props;
	return (
		<Grid item xs={4}>
			<Card>
				<CardContent>
					{props.children}
					{hasLink ? (
						<NextLink href={`/tags/${tagName}`}>
							<Typography
								variant="h6"
								gutterBottom
								style={{ cursor: 'pointer' }}
							>
								{tagName}
							</Typography>
						</NextLink>
					) : (
						<Typography variant="h6" gutterBottom>
							{tagName}
						</Typography>
					)}
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
