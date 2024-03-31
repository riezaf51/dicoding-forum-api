const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, payload) {
    const newReply = new NewReply(payload);
    await this._threadRepository.isThreadExist(newReply.threadId);
    await this._commentRepository.isCommentExist(newReply.commentId);
    return this._replyRepository.addReply(userId, newReply);
  }
}

module.exports = AddReplyUseCase;
