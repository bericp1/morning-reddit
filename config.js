var pkg = require('./package.json');

module.exports = exports = {
  snoocore: {
    userAgent: pkg.name + '@' + pkg.version,
    oauth: {
      type: 'explicit',
      key: process.env.REDDIT_KEY || '',
      secret: process.env.REDDIT_SECRET || '',
      scope: ['read'],
      redirectUri: 'http://morning-reddit.com/'
    }
  },
  port: process.env.PORT || 5000
};
