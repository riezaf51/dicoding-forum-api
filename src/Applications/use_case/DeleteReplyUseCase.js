const DeleteReply = require('../../Domains/replies/entities/DeleteReply');

class DeleteReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(userId, useCasePayload) {
    const deleteReply = new DeleteReply(useCasePayload);
    await this._threadRepository.isThreadExist(deleteReply.threadId);
    await this._commentRepository.isCommentExist(deleteReply.commentId);
    await this._replyRepository.isReplyExist(deleteReply.replyId);
    await this._replyRepository.verifyReplyOwner(userId, deleteReply.replyId);
    return this._replyRepository.deleteReply(deleteReply);
  }
}

module.exports = DeleteReplyUseCase;
