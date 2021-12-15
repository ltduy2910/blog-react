import { Grid, Avatar } from '@mui/material';
import moment from 'moment';

interface CommentCardProps {
	comment: {
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
	};
}

const CommentCard = (props: CommentCardProps) => {
	const { comment } = props;
	return (
		<>
			{comment && (
				<Grid container wrap="nowrap" spacing={2}>
					<Grid item>
						<Avatar
							alt={comment?.author?.name}
							src={comment?.author?.photoUrl}
						/>
					</Grid>
					<Grid justifyContent="left" item xs zeroMinWidth>
						<h4 style={{ margin: 0, textAlign: 'left' }}>
							{comment?.author?.name}
						</h4>
						<p style={{ textAlign: 'left' }}>{comment?.content}</p>
						<p style={{ textAlign: 'left', color: 'gray' }}>
							{moment(comment?.createdAt).fromNow()}
						</p>
					</Grid>
				</Grid>
			)}
		</>
	);
};
export default CommentCard;
