const LandingPage = ({ posts }) => {
	return (
		<div className="container py-5">
			<div className="logo">HeapOverflow</div>
			<div className="py-5"></div>
			<div className="row">
				<div className="col-sm-6 col-12">
					<div className="card mb-4">
						<div className="card-body d-flex flex-row">
							<div className="d-flex flex-column"></div>
							<div className="vote">
								<div className="vote-count text-center">0</div>
								<div className="text-center font-weight-bold">Vote</div>
							</div>
							<div className="discussion my-auto px-3">
								Judul sebuah diskusi yang dibuat oleh users
							</div>
							<div className="d-flex flex-column">
								<div className="tags">
									<span className="badge bg-light text-dark">tags</span>
									<span className="badge bg-light text-dark">tags</span>
									<span className="badge bg-light text-dark">tags</span>
								</div>
								<div className="text-muted post-footer mt-5 text-center">
									Oleh: UserDoc
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-sm-6 col-12">
					<div className="card">
						<div className="card-body">
							<h3 className="card-title text-center login-text">Login</h3>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
	const { data } = await client.get('/api/posts');

	return { posts: data };
};

export default LandingPage;
