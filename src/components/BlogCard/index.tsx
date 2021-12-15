import {
	Avatar,
	Card,
	CardContent,
	CardHeader,
	CardMedia,
	Typography,
} from '@mui/material';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { SampleImage } from '../../assets';

interface BlogCardProps {
	post: {
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
	};
}

const BlogCard = (props: BlogCardProps) => {
	const { post } = props;
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(`/blogs/${post?.id}`);
	};
	return (
		<Card
			onClick={() => {
				handleClick();
			}}
			sx={{ maxWidth: 345, height: 380 }}
		>
			<CardHeader
				avatar={
					<Avatar alt={post?.author?.name} src={post?.author?.photoUrl} />
				}
				title={post?.author?.name}
				subheader={moment(post?.createdAt).fromNow()}
			/>
			<CardMedia
				component="img"
				height="140"
				image={SampleImage}
				alt="green iguana"
			/>
			<CardContent>
				<Typography noWrap gutterBottom variant="h5" component="div">
					{post?.title}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{post?.description}
				</Typography>
			</CardContent>
			{/* <CardActions>
				<Button size="small">Share</Button>
				<Button size="small">Learn More</Button>
			</CardActions> */}
		</Card>
	);
};
export default BlogCard;
