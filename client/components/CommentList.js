import { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Router from 'next/router';

import {
	Card,
	CardContent,
	Box,
	Typography,
	NoSsr,
	Button,
} from '@material-ui/core';
import {
	ExpandLess as ExpandLessIcon,
	ExpandMore as ExpandMoreIcon,
} from '@material-ui/icons';

import MyDialogBox from './MyDialogBox';

import Toast from '../components/Toast';
import useRequest from '../hooks/use-request';
import { open } from '../redux/ducks/openload';

const CommentList = ({
	postId,
	comment,
	postUsername,
	solution,
	hasSolution,
	setHasSolution,
	children,
}) => {
	const dispatch = useDispatch();

	const [voteCount, setVoteCount] = useState(
		comment.votes.filter((vote) => vote.type === 'up').length -
			comment.votes.filter((vote) => vote.type === 'down').length
	);
	const [text, setText] = useState(comment.text);
	const [typeHandler, setTypeHandler] = useState('');
	const [postSolution, setPostSolution] = useState(solution);

	let username;
	let admin;

	if (typeof window !== 'undefined') {
		username = JSON.parse(localStorage.getItem('currentUser')).username;
		admin = JSON.parse(localStorage.getItem('currentUser')).is_admin;
	}
	const showDelete = comment.username === username || admin;
	const showUpdate = comment.username === username;

	const [hasVoted, setHasVoted] = useState(
		comment.votes.find((vote) => vote?.username === username)
	);
	const [voteClickUp, setVoteClickUp] = useState(
		Boolean(hasVoted?.type === 'up')
	);
	const [voteClickDown, setVoteClickDown] = useState(
		Boolean(hasVoted?.type === 'down')
	);

	const { doRequest } = useRequest({
		url: `/api/posts/comment/${comment.id}/vote`,
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

	const handleDelete = async (commentId) => {
		await axios.delete(`/api/posts/${postId}/comment/${commentId}`);
		dispatch(open(true));
		setTypeHandler('Delete');

		setTimeout(() => {
			Router.reload();
		}, 2000);
	};

	const handleUpdate = async (commentId) => {
		await axios.put(`/api/posts/comment/${commentId}`, {
			text,
		});
		dispatch(open(true));
		setTypeHandler('Update');

		setTimeout(() => {
			Router.reload();
		}, 2000);
	};

	const handleSolution = async (commentId) => {
		await axios.post(`/api/posts/${postId}/solution`, {
			commentId,
		});
		setPostSolution((prev) => !prev);
		setHasSolution((prev) => !prev);
	};

	return (
		<NoSsr>
			{typeHandler && (
				<Toast severity="success">
					{`Berhasil ${typeHandler} Comment, Reloading...`}
				</Toast>
			)}

			<Card
				style={{
					marginBottom: 20,
					backgroundColor: postSolution ? '#00FFA042' : 'white',
				}}
			>
				<CardContent>
					<Box display="flex" flexDirection="row" justifyContent="flex-start">
						<Box flexDirection="column" marginRight={3}>
							<ExpandLessIcon
								onClick={handleUpVote}
								style={{
									marginLeft: 3,
									cursor: 'pointer',
									color: voteClickUp && '#4CC9B0',
								}}
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
								onClick={handleDownVote}
								style={{
									marginLeft: 3,
									cursor: 'pointer',
									color: voteClickDown && '#4CC9B0',
								}}
							/>
						</Box>
						<Box flexDirection="row" style={{ width: '100%' }}>
							{username === postUsername && !hasSolution ? (
								<Button
									color="secondary"
									onClick={() => handleSolution(comment.id)}
								>
									Tandai Sebagai Solusi
								</Button>
							) : (
								username === postUsername &&
								postSolution && (
									<Button
										color="secondary"
										onClick={() => handleSolution(comment.id)}
									>
										Batalkan solusi
									</Button>
								)
							)}
							<Box display="flex" justifyContent="flex-end">
								<Box
									fontStyle="italic"
									display="flex"
									flexGrow={1}
									alignItems="center"
									mb={1}
								>
									<Typography variant="caption">
										Oleh: {comment.username}
									</Typography>
								</Box>
								{showUpdate && (
									<MyDialogBox
										buttonText="Edit"
										buttonColor="#4C72C9"
										dialogTitle="Edit Komentar"
										dialogText="Silahkan edit komentar anda dibawah"
										acceptText="Edit"
										showForm={comment.text}
										setText={setText}
										request={() => handleUpdate(comment.id)}
									/>
								)}
								{showDelete && (
									<MyDialogBox
										buttonText="Delete"
										buttonColor="#F6506C"
										dialogTitle="Hapus Komentar"
										dialogText="Kamu yakin ingin menghapus komentar?"
										acceptText="Delete"
										request={() => handleDelete(comment.id)}
									/>
								)}
							</Box>
							<Box style={{ width: '80%', borderTop: '1px solid #70707040' }}>
								{children}
							</Box>
						</Box>
					</Box>
				</CardContent>
			</Card>
		</NoSsr>
	);
};

export default CommentList;
