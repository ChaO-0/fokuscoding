import {
	Typography,
	makeStyles,
	Box,
	Card,
	CardContent,
	Chip,
	ThemeProvider,
	createMuiTheme,
} from '@material-ui/core';

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

const PostList = () => {
	const classes = useStyles();
	return (
		<ThemeProvider theme={theme}>
			<Card style={{ marginBottom: theme.spacing(2) }}>
				<CardContent>
					<Box display="flex" flexDirection="row" justifyContent="flex-start">
						<Box flexDirection="column" marginRight={3}>
							<Typography variant="h5" color="secondary" align="center">
								<Box fontWeight={600}>0</Box>
							</Typography>
							<Typography
								color="secondary"
								component="div"
								className={classes.voteFont}
								align="center"
							>
								<Box fontWeight={600}>VOTE</Box>
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
								<Typography variant="caption">5 menit yang lalu</Typography>
								<Box>
									<Chip className={classes.chip} label="Tags" />
									<Chip className={classes.chip} label="Tags" />
									<Chip className={classes.chip} label="Tags" />
									<Chip className={classes.chip} label="Tags" />
									<Chip className={classes.chip} label="Tags" />
								</Box>
							</Box>
							<Box py={1}>
								<Typography component="div">
									<Box fontWeight="bold">
										Judul sebuah diskusi yang dibuat oleh user sebagai judul
										yang ada pada forum Diskusi
									</Box>
								</Typography>
							</Box>
							<Box
								display="flex"
								justifyContent="flex-end"
								className={classes.createdBy}
							>
								Oleh: UserDoc
							</Box>
						</Box>
					</Box>
				</CardContent>
			</Card>
		</ThemeProvider>
	);
};

export default PostList;
