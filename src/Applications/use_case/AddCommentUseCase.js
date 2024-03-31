const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(userId, useCasePayload) {
    const newComment = new NewComment(useCasePayload);
    await this._threadRepository.isThreadExist(newComment.threadId);
    return this._commentRepository.addComment(userId, newComment);
  }
}

module.exports = AddCommentUseCase;
