const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(owner, useCasePayload) {
    const newComment = new NewComment(useCasePayload);
    await this._threadRepository.isThreadExist(newComment.threadId);
    return this._commentRepository.addComment(owner, newComment);
  }
}

module.exports = AddCommentUseCase;
