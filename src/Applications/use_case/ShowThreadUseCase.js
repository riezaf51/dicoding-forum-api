class ShowThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);
    const { threadId } = useCasePayload;
    await this._threadRepository.isThreadExist(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const replyPromises = comments
      .map((comment) => this._replyRepository.getRepliesByCommentId(comment.id));
    const likesPromises = comments
      .map((comment) => this._likeRepository.getLikeCount(comment.id));

    const replies = await Promise.all(replyPromises);
    const likes = await Promise.all(likesPromises);

    for (let i = 0; i < comments.length; i += 1) {
      comments[i].replies = replies[i];
      comments[i].likeCount = likes[i];
    }

    thread.comments = comments;
    return thread;
  }

  _verifyPayload(payload) {
    const { threadId } = payload;
    if (!threadId) {
      throw new Error('SHOW_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string') {
      throw new Error('SHOW_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ShowThreadUseCase;
