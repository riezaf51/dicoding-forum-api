class Reply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id,
      content,
      date,
      username,
      isDelete,
    } = payload;

    this.id = id;
    this.content = !isDelete ? content : '**balasan telah dihapus**';
    this.date = date;
    this.username = username;
  }

  _verifyPayload({
    id,
    content,
    date,
    username,
    isDelete,
  }) {
    if (!id || !content || !date || !username || isDelete === undefined) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof date !== 'string' || typeof username !== 'string' || typeof isDelete !== 'boolean') {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Reply;
