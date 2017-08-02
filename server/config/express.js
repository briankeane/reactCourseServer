/**
 * Express configuration -- takes the app as an argument and adds all the middleware
 *                          to it
 */

'use strict';

const morgan      =   require('morgan');
const bodyParser  =   require('body-parser');
const config      =   require('./environment');
const cors        =   require('cors');


module.exports.default = function (app) {
  app.use(morgan('dev'));
  app.use(cors());
  app.use(bodyParser.json({ type: '*/*' }));

}