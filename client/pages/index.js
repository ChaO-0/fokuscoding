import Link from 'next/link';
import styles from '../assets/css/indexPage.module.css';

const LandingPage = ({ posts }) => {
	return (
		<div className="container py-5">
			<div className={styles.logo}>HeapOverflow</div>
			<div className="py-5"></div>
			<div className="row">
				<div className="col-sm-6 col-12">
					<div className={`card mb-4`}>
						<div className="card-body d-flex flex-row">
							<div className="d-flex flex-column"></div>
							<div className={styles.vote}>
								<div className={`${styles.voteCount} text-center`}>0</div>
								<div className="text-center font-weight-bold">Vote</div>
							</div>
							<div className={`${styles.discussion} my-auto px-3`}>
								Judul sebuah diskusi yang dibuat oleh users
							</div>
							<div className="d-flex flex-column">
								<div className={styles.tags}>
									<span className="badge bg-light text-dark">tags</span>
									<span className="badge bg-light text-dark">tags</span>
									<span className="badge bg-light text-dark">tags</span>
								</div>
								<div
									className={`text-muted ${styles.postFooter} mt-5 text-center`}
								>
									Oleh: UserDoc
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-sm-6 col-12">
					<div className="card login-card mx-auto">
						<div className="card-body">
							<h3 className={`card-title text-center ${styles.loginText}`}>
								Login
							</h3>
							<form className={`container`}>
								<div className="form-group">
									<label htmlFor="email">Email</label>
									<input type="email" className="form-control" />
								</div>
								<div className="form-group">
									<label htmlFor="password">Password</label>
									<input type="password" className="form-control" />
								</div>
								<div className="text-center mt-4">
									<button type="submit" className={`btn ${styles.btnLogin}`}>
										Login
									</button>
									<div className="text-muted mt-2">
										Or{' '}
										<Link href="#">
											<a className={styles.regLink}>Register</a>
										</Link>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
			<style jsx>{`
				form input {
					background-color: #00000012;
				}

				.form-group label {
					color: #919191;
				}

				form .container {
					width: 90%;
				}

				.login-card {
					width: 80%;
				}

				.card {
					-webkit-box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
					-moz-box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
					box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
					border-radius: 10px;
				}
			`}</style>
		</div>
	);
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
	const { data } = await client.get('/api/posts');

	return { posts: data };
};

export default LandingPage;
