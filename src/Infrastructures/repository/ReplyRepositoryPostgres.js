const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const Reply = require('../../Domains/replies/entities/Reply');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(userId, newReply) {
    const { content, commentId } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, commentId, userId, content, date, false],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async isReplyExist(replyId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }
  }

  async verifyReplyOwner(userId, replyId) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }

    if (result.rows[0].owner !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async deleteReply(deleteReply) {
    const { replyId, commentId } = deleteReply;

    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1 AND comment_id = $2 RETURNING id',
      values: [replyId, commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: 'SELECT replies.id, content, date, username, is_delete FROM replies LEFT JOIN users ON replies.owner = users.id WHERE comment_id = $1 ORDER BY date ASC',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((row) => new Reply({ ...row, isDelete: row.is_delete }));
  }
}

module.exports = ReplyRepositoryPostgres;
