const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const Comment = require('../../Domains/comments/entities/Comment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(userId, newComment) {
    const { content, threadId } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, threadId, content, date, userId, false],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async isCommentExist(commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async verifyCommentOwner(userId, commentId) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    if (result.rows[0].owner !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async deleteComment(deleteComment) {
    const { commentId, threadId } = deleteComment;
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1 AND thread_id = $2 RETURNING id',
      values: [commentId, threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: 'SELECT comments.id AS id, username, comments.date AS date, content, is_delete FROM comments LEFT JOIN users ON comments.owner = users.id WHERE comments.thread_id = $1 ORDER BY comments.date ASC',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((row) => new Comment({
      ...row,
      isDelete: row.is_delete,
      replies: [],
      likeCount: 0,
    }));
  }
}

module.exports = CommentRepositoryPostgres;
