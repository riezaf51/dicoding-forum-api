const AddThreadUseCase = require('../AddThreadUseCase');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'thread title',
      body: 'thread body',
    };

    const mockAddedThread = {
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();

    // Mocking
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    await addThreadUseCase.execute('user-123', useCasePayload);

    // Assert
    expect(mockThreadRepository.addThread).toHaveBeenCalledWith('user-123', new NewThread(useCasePayload));
  });
});
