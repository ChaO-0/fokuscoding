import { Card, CardContent, Box, Typography } from '@material-ui/core';
import {
	ExpandLess as ExpandLessIcon,
	ExpandMore as ExpandMoreIcon,
} from '@material-ui/icons';

const CommentList = ({ comment, children }) => {
	return (
		<Card style={{ marginBottom: 20 }}>
			<CardContent>
				<Box display="flex" flexDirection="row" justifyContent="flex-start">
					<Box flexDirection="column" marginRight={3}>
						<ExpandLessIcon style={{ marginLeft: 3 }} />
						<Typography variant="h5" color="secondary" align="center">
							<Box fontWeight={600}>{0}</Box>
						</Typography>
						<Typography
							color="secondary"
							component="div"
							style={{ fontSize: 12 }}
							align="center"
						>
							<Box fontWeight={600} my="auto">
								VOTE
							</Box>
						</Typography>
						<ExpandMoreIcon style={{ marginLeft: 3 }} />
					</Box>
					<Box flexDirection="row" style={{ width: '100%' }}>
						<Box
							flexDirection="row"
							style={{
								borderBottom: '3px solid #707070',
								width: '80%',
								paddingBottom: 10,
							}}
						>
							<Typography
								variant="caption"
								style={{
									color: '#707070',
									fontStyle: 'italic',
								}}
							>
								Oleh: {comment.username}
							</Typography>
						</Box>
						<Box mt={3} style={{ width: '80%' }}>
							{children}
						</Box>
					</Box>
				</Box>
			</CardContent>
		</Card>
	);
};

export default CommentList;
