const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;
  }

  async putLikeHandler(request) {
    const { id: userId } = request.auth.credentials;
    const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name);
    await likeCommentUseCase.execute(userId, request.params);

    return {
      status: 'success',
    };
  }
}

module.exports = LikesHandler;
