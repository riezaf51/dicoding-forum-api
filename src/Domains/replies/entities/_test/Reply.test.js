const Reply = require('../Reply');

describe('Reply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'reply content',
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'reply content',
      date: '2021-08-08T07:59:17.000Z',
      username: ['dicoding'],
      isDelete: 'false',
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Reply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'reply content',
      date: '2021-08-08T07:59:17.000Z',
      username: 'dicoding',
      isDelete: false,
    };

    // Action
    const reply = new Reply(payload);

    // Assert
    expect(reply).toBeInstanceOf(Reply);
    expect(reply.id).toEqual(payload.id);
    expect(reply.content).toEqual(payload.content);
    expect(reply.date).toEqual(payload.date);
    expect(reply.username).toEqual(payload.username);
  });

  it('should create deleted Reply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'reply content',
      date: '2021-08-08T07:59:17.000Z',
      username: 'dicoding',
      isDelete: true,
    };

    // Action
    const reply = new Reply(payload);

    // Assert
    expect(reply).toBeInstanceOf(Reply);
    expect(reply.id).toEqual(payload.id);
    expect(reply.content).toEqual('**balasan telah dihapus**');
    expect(reply.date).toEqual(payload.date);
    expect(reply.username).toEqual(payload.username);
  });
});
