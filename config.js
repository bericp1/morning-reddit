var pkg = require('./package.json');

module.exports = exports = {
  snoocore: {
    userAgent: pkg.name + '@' + pkg.version,
    oauth: {
      type: 'script',
      key: process.env.REDDIT_KEY || '',
      secret: process.env.REDDIT_SECRET || '',
      username: process.env.REDDIT_USERNAME || '',
      password: process.env.REDDIT_PASSWORD || '',
      scope: [ 'read', 'identity' ]
    }
  },
  port: process.env.PORT || 5000
};
