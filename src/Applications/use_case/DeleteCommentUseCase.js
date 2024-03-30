const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(userId, useCasePayload) {
    const deleteComment = new DeleteComment(useCasePayload);
    await this._threadRepository.isThreadExist(deleteComment.threadId);
    await this._commentRepository.isCommentExist(deleteComment.commentId);
    await this._commentRepository.verifyCommentOwner(userId, deleteComment.commentId);
    return this._commentRepository.deleteComment(deleteComment);
  }
}

module.exports = DeleteCommentUseCase;
