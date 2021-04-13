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
}) => {
	const classes = useStyles();

	const router = useRouter();

	const { doRequest, errors } = useRequest({
		url: `/api/posts/${postId}`,
		method: 'delete',
		onSuccess: () => router.push('/post'),
	});

	const handleDelete = () => {
		doRequest();
	};

	return (
		<ThemeProvider theme={theme}>
			<Card style={{ marginBottom: theme.spacing(2) }}>
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
							>
								<Typography variant="caption">
									Terakhir diperbarui: {time}
								</Typography>
								<Box>
									{tags.map((tag) => (
										<Chip
											label={tag.name}
											key={tag.id}
											className={classes.chip}
										/>
									))}
								</Box>
							</Box>
							<Box py={1}>
								<NextLink href={`/post/${postId}`}>
									<Typography component="div" style={{ cursor: 'pointer' }}>
										<Box fontWeight="bold">{title}</Box>
									</Typography>
								</NextLink>
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
										<Button style={{ color: '#F6506C' }} onClick={handleDelete}>
											Delete
										</Button>
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
