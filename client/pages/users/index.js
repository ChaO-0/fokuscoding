import Layout from '../../components/Layout';
import {
	Card,
	CardContent,
	Table,
	TableBody,
	TableContainer,
	TableCell,
	TableHead,
	TableRow,
	Box,
	IconButton,
	Tooltip,
} from '@material-ui/core';
import {
	Check as CheckIcon,
	Clear as ClearIcon,
	Block as BlockIcon,
	SupervisorAccount as SuperVisorAccountIcon,
} from '@material-ui/icons';

import axios from 'axios';
const ShowUsers = ({ users }) => {
	console.log(users);
	return (
		<Layout currentUser={{ username: 'admin' }}>
			<Card>
				<CardContent>
					<h1>Daftar User</h1>
					<Box display="flex" justifyContent="center">
						<TableContainer
							style={{
								width: '80%',
								border: '1px solid #7e83825c',
								borderRadius: '2px',
							}}
						>
							<Table>
								<TableHead style={{ backgroundColor: '#56E6CA' }}>
									<TableRow>
										<TableCell align="center">No.</TableCell>
										<TableCell align="center">Username</TableCell>
										<TableCell align="center">Admin</TableCell>
										<TableCell align="center">Banned</TableCell>
										<TableCell align="center">Action</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{users.map((user, index) => (
										<TableRow key={user.id}>
											<TableCell align="center">{index + 1}</TableCell>
											<TableCell align="center">{user.username}</TableCell>
											<TableCell align="center">
												{user.is_admin ? (
													<CheckIcon style={{ color: '#4CC9B0' }} />
												) : (
													<ClearIcon style={{ color: '#F6506C' }} />
												)}
											</TableCell>
											<TableCell align="center">
												{user.banned ? (
													<CheckIcon style={{ color: '#4CC9B0' }} />
												) : (
													<ClearIcon style={{ color: '#F6506C' }} />
												)}
											</TableCell>
											<TableCell align="center">
												<Tooltip title="Jadikan Admin" placement="top" arrow>
													<IconButton style={{ color: '#4C72C9' }}>
														<SuperVisorAccountIcon />
													</IconButton>
												</Tooltip>
												<Tooltip title="Banned user" placement="top" arrow>
													<IconButton style={{ color: '#F6506C' }}>
														<BlockIcon />
													</IconButton>
												</Tooltip>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Box>
				</CardContent>
			</Card>
		</Layout>
	);
};

export const getServerSideProps = async ({ req }) => {
	const { data } = await axios.get(`${process.env.INGRESS_URI}/api/users`, {
		headers: req.headers,
	});

	return {
		props: {
			users: data,
		},
	};
};

export default ShowUsers;
