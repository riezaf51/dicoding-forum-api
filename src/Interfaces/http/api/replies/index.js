const RepliesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'replies',
  register: async (server, { container }) => {
    const usersHandler = new RepliesHandler(container);
    server.route(routes(usersHandler));
  },
};
