import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'
import PostItem from '../posts/PostItem'
import CommentForm from '../post/CommentForm'
import CommentItem from '../post/CommentItem'
import { getPost } from '../../actions/post'

const Post = ({ getPost, post: { post, loading }, match: { params } }) => {
	useEffect(() => {
		getPost(params.id)
	}, [getPost, params.id])

	return loading || post === null ? (
		<Spinner />
	) : (
		<>
			<Link to='/posts' className='btn'>
				Back To Posts
			</Link>
			{/* if show actions is false, like and delete functionality will not show so we can display a single post without those actions */}
			<PostItem post={post} showActions={false} />
			<CommentForm postId={post._id} />

			<div className='comments'>
				{post.comments.map(comment => (
					<CommentItem key={comment._id} comment={comment} postId={post._id} />
				))}
			</div>
		</>
	)
}

Post.propTypes = {
	getPost: PropTypes.func.isRequired,
	post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
	post: state.post
})

export default connect(mapStateToProps, { getPost })(Post)
