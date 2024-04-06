const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const Like = require('../../../Domains/likes/entities/Like');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  describe('addLike function', () => {
    it('should add like to database correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', threadId: 'thread-123' });

      const like = new Like({
        commentId: 'comment-123',
        threadId: 'thread-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepositoryPostgres.addLike('user-123', like);

      // Assert
      const likes = await LikesTableTestHelper.findLikeByUserAndCommentIds('user-123', 'comment-123');
      expect(likes).toHaveLength(1);
    });
  });

  describe('deleteLike function', () => {
    it('should remove like from database correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', threadId: 'thread-123' });
      await LikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });

      const like = new Like({
        commentId: 'comment-123',
        threadId: 'thread-123',
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      await likeRepositoryPostgres.deleteLike('user-123', like);

      // Assert
      const likes = await LikesTableTestHelper.findLikeByUserAndCommentIds('user-123', 'comment-123');
      expect(likes).toHaveLength(0);
    });

    it('should throw NotFoundError when like not found', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(likeRepositoryPostgres.deleteLike('user-123', 'comment-123'))
        .rejects.toThrowError(NotFoundError);
    });
  });

  describe('isLikeExist function', () => {
    it('should throw NotFoundError when like not exist', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(likeRepositoryPostgres.isLikeExist('user-123', 'comment-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when like is exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', threadId: 'thread-123' });
      await LikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(likeRepositoryPostgres.isLikeExist('user-123', 'comment-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getLikeCount function', () => {
    it('should return like count correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', threadId: 'thread-123' });
      await LikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const likeCount = await likeRepositoryPostgres.getLikeCount('comment-123');

      // Assert
      expect(likeCount).toEqual(1);
    });
  });
});
