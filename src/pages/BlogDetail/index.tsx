import React from 'react';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Grid,
	TextField,
	Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';
import 'react-quill/dist/quill.snow.css';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import moment from 'moment';
import CommentCard from '../../components/CommentCard';
import { POSTS_QUERY } from '../Home';

const GET_POST = gql`
	query Post($postId: String!) {
		post(postId: $postId) {
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
			comments {
				id
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
	}
`;

const ADD_COMMENT = gql`
	mutation AddComment($inputComment: InputComment) {
		addComment(inputComment: $inputComment) {
			code
			success
			message
			comment {
				id
				content
				author {
					email
					id
					name
				}
				createdAt
				updatedAt
			}
		}
	}
`;

const DELETE_POST = gql`
	mutation Mutation($postId: String!) {
		delete(postId: $postId) {
			code
			success
			message
			post {
				id
				title
				description
				content
			}
		}
	}
`;

const BlogDetail = () => {
	const navigate = useNavigate();
	const { isAuthenticated, user } = useAuth0();
	const [comment, setComment] = React.useState('');
	const [openDelete, setOpenDelete] = React.useState(false);
	let params = useParams();
	const { blogId } = params;
	const [getPost, { loading: getPostLoading, data, refetch }] = useLazyQuery(
		GET_POST,
		{
			onCompleted(data) {},
			onError(error) {
				alert(error.message);
			},
		}
	);
	const [addComment, { loading: addCommentLoading }] = useMutation(
		ADD_COMMENT,
		{
			onCompleted(_data) {
				setComment('');
				refetch();
			},
			onError(error) {
				alert(error.message);
			},
		}
	);

	const [delelePost] = useMutation(DELETE_POST, {
		update(cache, { data: { delelePost } }) {
			const exsitingPosts: any = cache.readQuery({ query: POSTS_QUERY });
			const newPosts = exsitingPosts!.posts.filter((t: any) => t.id !== blogId);
			cache.writeQuery({
				query: POSTS_QUERY,
				data: { posts: newPosts },
			});
		},
		onCompleted(_data) {
			navigate('/');
		},
		onError(error) {
			alert(error.message);
		},
	});
	const handleDelete = async () => {
		await delelePost({
			variables: {
				postId: data?.post?.id,
			},
		});
	};

	const handleClickOpenDelete = () => {
		setOpenDelete(true);
	};

	const handleCloseDelete = () => {
		setOpenDelete(false);
	};

	const isOwnPost = user?.email === data?.post?.author?.email;

	const handleAddComment = async () => {
		if (!comment) {
			alert('You must enter somethings to comment');
			return;
		}
		await addComment({
			variables: {
				inputComment: {
					postId: data?.post?.id,
					email: user?.email,
					content: comment,
				},
			},
		});
	};

	React.useEffect(() => {
		getPost({
			variables: { postId: blogId },
		});
	}, []);

	return (
		<div>
			{data?.post && (
				<Box style={{ marginTop: 20 }} sx={{ flexGrow: 1 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} md={12}>
							<Box sx={{ width: '100%' }}>
								<Typography variant="h3" component="div">
									{data?.post?.title}
								</Typography>
								<Typography align="right" variant="subtitle2" component="div">
									Posted at:{' '}
									{moment(data?.post?.createdAt).format('DD-MM-YYYY')}
								</Typography>
								<Typography align="right" variant="subtitle2" component="div">
									Updated {moment(data?.post?.updatedAt).fromNow()}
								</Typography>
								<Typography variant="subtitle1" component="div">
									{data?.post?.description}
								</Typography>
							</Box>
						</Grid>
						{isOwnPost && (
							<Grid item xs={12} md={12}>
								<Box sx={{ width: '100%' }}>
									<Grid container xs={12} md={12} spacing={2}>
										<Grid item xs={4} md={2}>
											<Button
												onClick={() => {
													navigate(`/blogs/${data?.post?.id}/edit`, {
														state: {
															post: data?.post,
														},
													});
												}}
												fullWidth
												variant="contained"
											>
												Edit
											</Button>
										</Grid>
										<Grid item xs={4} md={2}>
											<Button
												onClick={handleClickOpenDelete}
												fullWidth
												variant="outlined"
											>
												Delete
											</Button>
										</Grid>
									</Grid>
								</Box>
							</Grid>
						)}
						<Grid item xs={12} md={12}>
							<Box sx={{ width: '100%' }}>
								<div> {ReactHtmlParser(data?.post?.content)} </div>
							</Box>
						</Grid>
						<Grid item xs={12} md={12}>
							<Grid container spacing={2}>
								<Grid item xs={12} md={12}>
									<Typography variant="h5" component="div">
										Comments({data?.post?.comments?.length || 0})
									</Typography>
								</Grid>
								{data?.post?.comments &&
									data?.post?.comments.map(
										(comment: {
											id: string;
											content: string;
											post: any;
											author: {
												id: string;
												email: string;
												name: string;
												photoUrl: string;
											};
											createdAt: Date;
											updateAt: Date;
										}) => (
											<Grid key={comment.id} item xs={12} md={12}>
												<CommentCard comment={comment} />
											</Grid>
										)
									)}

								<Grid item xs={12} md={12}>
									{isAuthenticated ? (
										<Box sx={{ width: '100%', marginBottom: 5 }}>
											<TextField
												id="comment"
												value={comment}
												onChange={(e) => {
													setComment(e.target.value);
												}}
												fullWidth
												label="Comment"
												multiline
												rows={4}
											/>
											<Button
												onClick={handleAddComment}
												disabled={addCommentLoading}
												sx={{ marginTop: 1 }}
												variant="contained"
											>
												Send
											</Button>
										</Box>
									) : (
										<Box sx={{ width: '100%', marginBottom: 5 }}>
											<Typography align="center">
												Please sign in to comment
											</Typography>
										</Box>
									)}
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Box>
			)}
			<Dialog
				open={openDelete}
				onClose={handleCloseDelete}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Do you sure to delete your post?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDelete}>Disagree</Button>
					<Button onClick={handleDelete} autoFocus>
						Agree
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default BlogDetail;
