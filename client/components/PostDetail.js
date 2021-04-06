import { useState } from 'react';
import {
	Card,
	CardContent,
	Box,
	Typography,
	Chip,
	NoSsr,
} from '@material-ui/core';
import {
	ExpandLess as ExpandLessIcon,
	ExpandMore as ExpandMoreIcon,
} from '@material-ui/icons';
import moment from 'moment';

import useRequest from '../hooks/use-request';

const PostDetail = ({ post, content }) => {
	const [voteCount, setVoteCount] = useState(
		post.votes.filter((vote) => vote.type === 'up').length -
			post.votes.filter((vote) => vote.type === 'down').length
	);

	let username;

	if (typeof window !== 'undefined') {
		username = JSON.parse(localStorage.getItem('currentUser')).username;
	}

	const [hasVoted, setHasVoted] = useState(
		post.votes.find((vote) => vote.username === username)
	);

	const [voteClickUp, setVoteClickUp] = useState(
		Boolean(hasVoted?.type === 'up')
	);
	const [voteClickDown, setVoteClickDown] = useState(
		Boolean(hasVoted?.type === 'down')
	);

	const { doRequest } = useRequest({
		url: `/api/posts/${post.id}/vote`,
		method: 'post',
	});

	const handleUpVote = () => {
		doRequest({ voteType: 'up' });
		if (voteClickUp !== true) {
			if (hasVoted?.type === 'down') {
				setHasVoted((prev) => ({ ...prev, type: 'up' }));
				setVoteCount((prev) => prev + 2);
				setVoteClickUp(true);
				setVoteClickDown(false);
			} else {
				setHasVoted((prev) => ({ ...prev, type: 'up' }));
				setVoteCount((prev) => prev + 1);
				setVoteClickUp(true);
			}
		} else {
			setHasVoted((prev) => ({ ...prev, type: '' }));
			setVoteCount((prev) => prev - 1);
			setVoteClickUp(false);
		}
	};

	const handleDownVote = () => {
		doRequest({ voteType: 'down' });
		if (voteClickDown !== true) {
			if (hasVoted?.type === 'up') {
				setHasVoted((prev) => ({ ...prev, type: 'down' }));
				setVoteCount((prev) => prev - 2);
				setVoteClickDown(true);
				setVoteClickUp(false);
			} else {
				setHasVoted((prev) => ({ ...prev, type: 'down' }));
				setVoteCount((prev) => prev - 1);
				setVoteClickDown(true);
			}
		} else {
			setHasVoted((prev) => ({ ...prev, type: '' }));
			setVoteCount((prev) => prev + 1);
			setVoteClickDown(false);
		}
	};

	return (
		<NoSsr>
			<Card>
				<CardContent>
					<Box display="flex" flexDirection="row" justifyContent="flex-start">
						<Box flexDirection="column" marginRight={3}>
							<ExpandLessIcon
								style={{
									marginLeft: 3,
									cursor: 'pointer',
									color: voteClickUp && '#4CC9B0',
								}}
								onClick={handleUpVote}
							/>
							<Typography variant="h5" color="secondary" align="center">
								<Box fontWeight={600}>{voteCount}</Box>
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
							<ExpandMoreIcon
								style={{
									marginLeft: 3,
									cursor: 'pointer',
									color: voteClickDown && '#4CC9B0',
								}}
								onClick={handleDownVote}
							/>
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
								<Box>
									{post.tags.map((tag) => (
										<Chip
											label={tag.name}
											key={tag.id}
											style={{
												backgroundColor: '#4CC9B040',
												color: '#4CC9B0',
												borderRadius: 0,
												margin: '0 3px',
											}}
										/>
									))}
								</Box>
								<Typography variant="h4">{post.title}</Typography>
								<Box flexDirection="column">
									<Typography
										variant="caption"
										style={{
											marginRight: 50,
											color: '#707070',
											fontStyle: 'italic',
										}}
									>
										Dibuat tanggal:{' '}
										{moment(new Date(post.createdAt)).format('DD-MM-YYYY')}
									</Typography>
									<Typography
										variant="caption"
										style={{ color: '#707070', fontStyle: 'italic' }}
									>
										Terakhir diperbarui: {moment(post.updatedAt).fromNow()}
									</Typography>
								</Box>
								<Typography
									variant="caption"
									style={{
										color: '#707070',
										fontStyle: 'italic',
									}}
								>
									Oleh: {post.username}
								</Typography>
							</Box>
							<Box mt={3} style={{ width: '80%' }}>
								{content}
							</Box>
						</Box>
					</Box>
				</CardContent>
			</Card>
		</NoSsr>
	);
};

export default PostDetail;
