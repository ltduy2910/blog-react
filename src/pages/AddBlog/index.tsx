import React from 'react';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
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

const ADD_POST = gql`
	mutation Mutation($inputPost: InputPost!) {
		addPost(inputPost: $inputPost) {
			code
			success
			message
			post {
				id
				title
				content
				description
			}
		}
	}
`;

const AddBlog = () => {
	const { isAuthenticated, user } = useAuth0();
	const navigate = useNavigate();

	const { handleSubmit, control, setValue } = useForm<IFormInputs>();
	const [addPost, { loading, reset }] = useMutation(ADD_POST, {
		update(cache, { data: { addPost } }) {
			debugger;
			cache.modify({
				fields: {
					posts(existingPosts = []) {
						const newPostRef = cache.writeFragment({
							data: addPost.post,
							fragment: gql`
								fragment NewPost on Post {
									id
									title
									content
									description
								}
							`,
						});
						return [...existingPosts, newPostRef];
					},
				},
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
			title: data.title,
			content: data.content,
			description: data.description,
			email: user?.email,
		};
		console.log('formData', formData);
		await addPost({
			variables: { inputPost: formData },
		});
	};

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
								Add new Blog
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
											defaultValue={''}
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
												defaultValue={''}
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
												defaultValue={''}
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
											Publish
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

export default AddBlog;
