const index = require('../controllers/index');
const users = require('../controllers/users');

module.exports = (app) => {
  app.use('/', index);

  app.use('/users', users);
}