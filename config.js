var pkg = require('./package.json');

modules.export = {
  snoocore: {
    userAgent: pkg.name + '@' + pkg.version,
    oauth: {
      type: 'script',
      key: 'Ewsu6qt3wOgruQ',
      secret: 'bCcXwIFSsmoE99kaNtldgr32LIo',
      username: process.env.REDDIT_USERNAME || '',
      password: process.env.REDDIT_PASS || '',
      scope: [ 'read', 'identity' ]
    }
  },
  port: process.env.PORT || 5000
};
