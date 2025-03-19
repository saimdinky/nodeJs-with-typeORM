const log4js = require('log4js');
const context = require('./async-context');

let customLogger;
let currentUser = 'SYSTEM';

const setupLogger = () => {
  log4js.configure({
    appenders: {
      out: {
        type: 'stdout',
        layout: {
          type: 'pattern',
          pattern: '%[ %d{dd-MM-yyyy hh:mm:ss} %p %x{user} %l %f{4} %m %] %n',
          tokens: {
            user: () => currentUser,
          },
        },
      },
    },
    categories: {
      default: {
        appenders: ['out'],
        level: 'all',
        enableCallStack: true,
      },
    },
  });
  customLogger = log4js.getLogger();
  customLogger.level = 'debug';
  return customLogger;
};

const logger = customLogger || setupLogger();

const setCurrentUser = (user) => {
  currentUser = user;
};

module.exports = {
  logger,
  setCurrentUser,
};
