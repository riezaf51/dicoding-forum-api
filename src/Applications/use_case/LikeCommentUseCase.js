const Like = require('../../Domains/likes/entities/Like');

class LikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(userId, useCasePayload) {
    const like = new Like(useCasePayload);
    await this._threadRepository.isThreadExist(like.threadId);
    await this._commentRepository.isCommentExist(like.commentId);
    try {
      await this._likeRepository.isLikeExist(userId, like.commentId);
      return this._likeRepository.deleteLike(userId, like);
    } catch {
      return this._likeRepository.addLike(userId, like);
    }
  }
}

module.exports = LikeCommentUseCase;
