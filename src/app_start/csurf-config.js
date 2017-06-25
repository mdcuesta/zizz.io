const csrf = require('csurf');


module.exports = (app) => {
  const csurf = csrf({ cookie: true });
  app.use((req, res, next) => {
    csurf(req, res, next);
  });
}
