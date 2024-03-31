const ShowThreadUseCase = require('../ShowThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('ShowThreadUseCase', () => {
  it('should throw error if use case payload not contain needed property', async () => {
    // Arrange
    const useCasePayload = {};
    const showThreadUseCase = new ShowThreadUseCase({});

    // Action & Assert
    await expect(showThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('SHOW_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if use case payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 123,
    };
    const showThreadUseCase = new ShowThreadUseCase({});

    // Action & Assert
    await expect(showThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('SHOW_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the show thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };
    const mockThread = {
      id: 'thread-123',
      title: 'Super Title',
      body: 'Super Body',
      date: '2021-08-08T07:59:18.077Z',
      username: 'dicoding',
    };
    const mockComments = [{
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:59:18.077Z',
      content: 'Super Comment',
    }];
    const mockReplies = [{
      id: 'reply-123',
      content: 'Super Reply',
      date: '2021-08-08T07:59:18.077Z',
      username: 'dicoding',
    }];
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // Mocking
    mockThreadRepository.isThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComments));
    mockReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReplies));

    // Creating use case instance
    const showThreadUseCase = new ShowThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const thread = await showThreadUseCase.execute(useCasePayload);

    // Assert
    expect(thread).toStrictEqual({
      id: mockThread.id,
      title: mockThread.title,
      body: mockThread.body,
      date: mockThread.date,
      username: mockThread.username,
      comments: mockComments,
    });
    expect(thread.comments[0].replies).toStrictEqual(mockReplies);
    expect(mockThreadRepository.isThreadExist)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockThreadRepository.getThreadById)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsByThreadId)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockReplyRepository.getRepliesByCommentId)
      .toHaveBeenCalledWith(mockComments[0].id);
  });
});
