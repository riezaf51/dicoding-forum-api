class Commment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id,
      username,
      date,
      replies,
      content,
      likeCount,
      isDelete,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.replies = replies;
    this.likeCount = likeCount;
    this.content = !isDelete ? content : '**komentar telah dihapus**';
  }

  _verifyPayload({
    id,
    username,
    date,
    replies,
    content,
    likeCount,
    isDelete,
  }) {
    if (!id || !username || !date || !replies || !content
      || likeCount === undefined || isDelete === undefined) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string' || !Array.isArray(replies) || typeof content !== 'string' || typeof likeCount !== 'number' || typeof isDelete !== 'boolean') {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Commment;
