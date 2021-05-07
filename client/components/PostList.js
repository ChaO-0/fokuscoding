import {
	Typography,
	makeStyles,
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	ThemeProvider,
	createMuiTheme,
} from '@material-ui/core';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import useRequest from '../hooks/use-request';
import MyDialogBox from './MyDialogBox';

const useStyles = makeStyles((theme) => ({
	voteFont: {
		fontSize: 12,
	},
	badge: {
		height: 20,
		width: 10,
		fontSize: 8,
	},
	createdBy: {
		fontStyle: 'italic',
		color: '#707070',
	},
	chip: {
		backgroundColor: '#4CC9B040',
		color: '#4CC9B0',
		borderRadius: 0,
		margin: theme.spacing(0, 0.3),
		marginTop: '3px',
		'&:hover': {
			background: '#4CC9B040',
		},
	},
}));

const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#56E6CA',
		},
		secondary: {
			main: '#4CC9B0',
		},
	},
	typography: {
		h5: {
			fontSize: 35,
		},
		caption: {
			color: '#707070',
		},
	},
});

const PostList = ({
	title,
	voteCount,
	tags = [],
	createdBy,
	time,
	postId,
	editButton,
	deleteButton,
	children,
	hasSolution,
}) => {
	const classes = useStyles();

	const router = useRouter();

	const { doRequest, errors } = useRequest({
		url: `/api/posts/${postId}`,
		method: 'delete',
		onSuccess: () => router.reload(),
	});

	const handleDelete = async () => {
		await doRequest();
	};

	return (
		<ThemeProvider theme={theme}>
			<Card
				style={{
					marginBottom: theme.spacing(2),
					backgroundColor: hasSolution ? '#00FFA042' : '#FFF',
				}}
			>
				<CardContent>
					<Box display="flex" flexDirection="row" justifyContent="flex-start">
						<Box flexDirection="column" marginRight={3}>
							<Typography variant="h5" color="secondary" align="center">
								<Box fontWeight={600}>{voteCount}</Box>
							</Typography>
							<Typography
								color="secondary"
								component="div"
								className={classes.voteFont}
								align="center"
							>
								<Box fontWeight={600} my="auto">
									VOTE
								</Box>
							</Typography>
						</Box>
						<Box
							display="flex"
							flexDirection="column"
							style={{ width: '100%' }}
						>
							<Box
								display="flex"
								justifyContent="space-between"
								flexDirection="row"
								alignItems="center"
							>
								<Box display="flex" alignItems="center">
									<Typography variant="caption">{time}</Typography>
								</Box>
								<Box>
									{tags.map((tag) => (
										<NextLink href={`/tags/${tag.name}`}>
											<Chip
												label={tag.name}
												key={tag.id}
												className={classes.chip}
											/>
										</NextLink>
									))}
								</Box>
							</Box>
							<Box py={1}>
								{postId ? (
									<NextLink href={`/post/${postId}`}>
										<Typography component="div" style={{ cursor: 'pointer' }}>
											<Box fontWeight="bold">{title}</Box>
										</Typography>
									</NextLink>
								) : (
									<Typography gutterBottom component="div">
										<Box fontWeight="bold">{title}</Box>
									</Typography>
								)}
								{children}
							</Box>
							<Box
								display="flex"
								justifyContent="space-between"
								className={classes.createdBy}
							>
								<Box>
									{editButton && (
										<NextLink href={`/update/${postId}`}>
											<Button style={{ color: '#4C72C9' }}>Edit</Button>
										</NextLink>
									)}
									{deleteButton && (
										<MyDialogBox
											buttonText="Delete"
											buttonColor="#F6506C"
											dialogTitle="Delete Post"
											dialogText="Kamu yakin ingin menghapus postingan ini?"
											acceptText="Delete"
											request={() => handleDelete(handleDelete)}
										/>
									)}
								</Box>
								<Box>Oleh: {createdBy}</Box>
							</Box>
						</Box>
					</Box>
				</CardContent>
			</Card>
		</ThemeProvider>
	);
};

export default PostList;
