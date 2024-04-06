class Like {
  constructor(payload) {
    this._verifyPayload(payload);

    const { threadId, commentId } = payload;

    this.threadId = threadId;
    this.commentId = commentId;
  }

  _verifyPayload({ threadId, commentId }) {
    if (!threadId || !commentId) {
      throw new Error('LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string' || typeof commentId !== 'string') {
      throw new Error('LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Like;
