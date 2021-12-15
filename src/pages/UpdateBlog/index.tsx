import React from 'react';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { gql, useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { POSTS_QUERY } from '../Home';
interface IFormInputs {
	title: string;
	description: string;
	content: string;
}

const UPDATE_POST = gql`
	mutation Mutation($inputUpdatePost: InputUpdatePost!) {
		updatePost(inputUpdatePost: $inputUpdatePost) {
			code
			success
			message
			post {
				id
				title
				description
				content
				createdAt
				updatedAt
			}
		}
	}
`;

const UpdateBlog = () => {
	const { isAuthenticated } = useAuth0();
	const navigate = useNavigate();
	const location = useLocation();
	const { state } = location;

	const { handleSubmit, control, setValue } = useForm<IFormInputs>();
	const [updatePost, { loading, reset }] = useMutation(UPDATE_POST, {
		update(cache, { data: { updatePost } }) {
			const exsitingPosts: any = cache.readQuery({ query: POSTS_QUERY });
			const newPosts = exsitingPosts!.posts.map((t: any) => {
				if (t.id === state?.post?.id) {
					return updatePost.post;
				} else return t;
			});
			cache.writeQuery({
				query: POSTS_QUERY,
				data: { posts: newPosts },
			});
		},
		onCompleted(data) {
			navigate('/');
		},
		onError(error) {
			alert(error.message);
			reset();
		},
	});

	if (!isAuthenticated) {
		navigate('/');
	}

	const [convertedText, setConvertedText] = React.useState('');
	const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
		console.log('data', data);
		const formData = {
			postId: state?.post?.id,
			title: data.title,
			content: data.content,
			description: data.description,
		};
		console.log('formData', formData);
		await updatePost({
			variables: { inputUpdatePost: formData },
		});
	};
	React.useEffect(() => {
		setConvertedText(state?.post?.content);
	}, []);
	React.useEffect(() => {
		setValue('content', convertedText);
	}, [convertedText, setValue]);

	return (
		<div>
			<Box style={{ marginTop: 20 }} sx={{ flexGrow: 1 }}>
				<Grid container spacing={2}>
					<Grid item xs={12} md={12}>
						<Box sx={{ width: '100%' }}>
							<Typography variant="h3" component="div">
								Update Blog
							</Typography>
						</Box>
					</Grid>
					<Grid item xs={12} md={12}>
						<Box sx={{ width: '100%' }}>
							<form onSubmit={handleSubmit(onSubmit)}>
								<Grid container spacing={2}>
									<Grid item xs={12} md={12}>
										<Controller
											name="title"
											control={control}
											defaultValue={state?.post?.title}
											rules={{ required: true }}
											render={({ field }) => (
												<TextField
													fullWidth
													label="Title"
													required
													{...field}
												/>
											)}
										/>
									</Grid>
									<Grid item xs={12} md={12}>
										<Grid item xs={12} md={12}>
											<Controller
												name="description"
												control={control}
												defaultValue={state?.post?.description}
												render={({ field }) => (
													<TextField
														fullWidth
														label="Short Description"
														{...field}
													/>
												)}
											/>
										</Grid>
									</Grid>
									<Grid item xs={12} md={12}>
										<Box sx={{ minHeight: 300, width: '100%' }}>
											<Controller
												name="content"
												control={control}
												defaultValue={state?.post?.content}
												render={({ field }) => (
													<ReactQuill
														theme="snow"
														value={convertedText}
														onChange={setConvertedText}
														style={{ minHeight: '300px' }}
													/>
												)}
											/>
										</Box>
									</Grid>

									<Grid item xs={12} md={12}>
										<Button
											disabled={loading}
											type="submit"
											variant="contained"
										>
											Update
										</Button>
										{/* <input type="submit" /> */}
									</Grid>
								</Grid>
							</form>
						</Box>
					</Grid>
				</Grid>
			</Box>
		</div>
	);
};

export default UpdateBlog;
