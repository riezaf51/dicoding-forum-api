class DeleteReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { replyId, commentId, threadId } = payload;

    this.replyId = replyId;
    this.commentId = commentId;
    this.threadId = threadId;
  }

  _verifyPayload({ replyId, commentId, threadId }) {
    if (!replyId || !commentId || !threadId) {
      throw new Error('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof replyId !== 'string' || typeof commentId !== 'string' || typeof threadId !== 'string') {
      throw new Error('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteReply;
