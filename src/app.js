const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sassMiddleWare = require('node-sass-middleware');
const compression = require('compression');
const helmet = require('helmet');
const session = require('express-session');
const cors = require('cors');

const viewEngine = require('express-dot-engine');
const viewHelpersConfig = require('./app_start/view-helpers-config');
const pathConfig = require('./app_start/path-config');
const csurfConfig = require('./app_start/csurf-config');
const routeConfig = require('./app_start/route-config');

const forceSslMiddleWare = require('./middlewares/force-ssl-middleware');
const commonSessionMiddleWare = require('./middlewares/common-session-middleware');

const version = require('./utilities/version');



const app = express();

const PRODUCTION = 'production';
const DEVELOPMENT = 'development';
const environment = app.get('env');

// view engine setup
viewEngine.settings.dot = {
  evaluate:    /\{\{([\s\S]+?)\}\}/g,
  interpolate: /\{\{=([\s\S]+?)\}\}/g,
  encode:      /\{\{!([\s\S]+?)\}\}/g,
  use:         /\{\{#([\s\S]+?)\}\}/g,
  define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
  conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
  iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
  varname: 'layout, partial, locals, model',
  strip: environment === PRODUCTION,
  append: true,
  selfcontained: false
};
viewHelpersConfig(viewEngine);
app.engine('dot', viewEngine.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'dot');

if (environment === 'production') {
  app.use(forceSslMiddleWare);
}

app.use(cors({
  origin: [process.env.CDN_DISTRIBUTION_URL || '/', process.env.APP_DOMAIN || '/'],
  optionsSuccessStatus: 200,
}));


app.use(favicon(path.join(__dirname, 'images', 'logo-transparent.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

csurfConfig(app);
// localization
app.use(commonSessionMiddleWare());

app.use(sassMiddleWare({
  src: path.join(__dirname, 'styles'),
  dest: path.join(__dirname, 'styles'),
  debug: environment === DEVELOPMENT,
  outputStyle: environment === DEVELOPMENT ? 'extended' : 'compressed',
  prefix: `/${version}/stylesheets`,
  force: true,
}));

app.use(compression());
app.use(helmet());
app.set('trust proxy', 1);
app.use(session({
  secret: process.env.SESSION_SECRET || 'anonymous penguin',
  resave: false,
  saveUninitialized: true,
  name: 'zizz-io-id',
  cookie: {
    secure: environment === PRODUCTION,
  },
}));

pathConfig(app);
routeConfig(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;