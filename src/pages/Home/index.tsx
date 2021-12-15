import React from 'react';
import {
	Box,
	Button,
	FormControl,
	Grid,
	Input,
	InputAdornment,
	InputLabel,
} from '@mui/material';
import IconSearch from '@mui/icons-material/Search';
import BlogCard from '../../components/BlogCard';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { useLocation, useNavigate } from 'react-router-dom';

export const POSTS_QUERY = gql`
	query Query($searchString: String) {
		posts(searchString: $searchString) {
			id
			title
			description
			content
			author {
				id
				email
				name
				photoUrl
			}
			createdAt
			updatedAt
		}
	}
`;

const SIGNIN_MUTATION = gql`
	mutation Mutation($inputUser: InputUser!) {
		signinWithAuth0(inputUser: $inputUser) {
			code
			success
			message
			user {
				email
				name
				provider
				photoUrl
			}
		}
	}
`;

const Home = () => {
	const navigate = useNavigate();
	const [searchString, setSearchstring] = React.useState('');
	const { isAuthenticated, user } = useAuth0();
	const [getPosts, { loading, data }] = useLazyQuery(POSTS_QUERY);
	const [signInWithAuth0, { loading: signInLoading }] =
		useMutation(SIGNIN_MUTATION);

	React.useEffect(() => {
		if (isAuthenticated && user) {
			signInWithAuth0({
				variables: {
					inputUser: {
						name: user?.name,
						email: user?.email,
						provider: user?.sub,
						photoUrl: user?.picture,
					},
				},
			});
		}
	}, [isAuthenticated, signInWithAuth0, user]);

	React.useEffect(() => {
		getPosts();
	}, []);

	React.useEffect(() => {
		console.log('posts', data);
	}, [data]);

	const handleSearch = () => {
		getPosts({ variables: { searchString: searchString } });
	};

	return (
		<div>
			<Box style={{ marginTop: 20 }} sx={{ flexGrow: 1 }}>
				<Grid container spacing={2}>
					<Grid item xs={12} md={12}>
						<Box sx={{ width: '100%' }}>
							<Grid container spacing={2}>
								<Grid item xs={10} md={10}>
									<FormControl fullWidth variant="standard">
										<InputLabel htmlFor="input-with-icon-adornment">
											Search topics and key word
										</InputLabel>
										<Input
											id="input-with-icon-adornment"
											onChange={(e) => {
												setSearchstring(e.target.value);
											}}
											startAdornment={
												<InputAdornment position="start">
													<IconSearch />
												</InputAdornment>
											}
										/>
									</FormControl>
								</Grid>
								<Grid item xs={2} md={2}>
									<Button
										style={{ marginTop: 10 }}
										variant="contained"
										onClick={() => handleSearch()}
									>
										Search
									</Button>
								</Grid>
							</Grid>
						</Box>
					</Grid>
					<Grid item xs={12} md={12}>
						{isAuthenticated && (
							<Button
								style={{ marginTop: 10 }}
								variant="outlined"
								onClick={() => navigate('/add-blog')}
							>
								Add new blog
							</Button>
						)}
					</Grid>
					<Grid item xs={12} md={12}>
						<Box sx={{ width: '100%' }}>
							<Grid
								container
								rowSpacing={2}
								columnSpacing={{ xs: 1, sm: 2, md: 3 }}
							>
								{data?.posts &&
									data?.posts.map(
										(post: {
											id: string;
											title: string;
											description: string;
											content: string;
											author: {
												id: string;
												name: string;
												email: string;
												photoUrl: string;
											};
											createdAt: Date;
											updatedAt: Date;
										}) => (
											<Grid key={post.id} item xs={4}>
												<BlogCard post={post} />
											</Grid>
										)
									)}
							</Grid>
						</Box>
					</Grid>
				</Grid>
			</Box>
		</div>
	);
};
export default Home;
