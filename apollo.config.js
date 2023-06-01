// const apolloConfig = {
//   // graphId: 'daylist', // TODO after vercel deploy
//   graphId: 'davi-alexandres-team-rsnxw',
//   graphVariant: 'main',
// };

module.exports = {
  client: {
    tagName: '', // matches graphql(``)
    service: {
      name: 'localhost',
      url: 'http://localhost:3000/graphql',
    },
    // process.env.NODE_ENV !== 'production' || true
    //   ? {
    //       name: 'localhost',
    //       url: 'http://localhost:3000/graphql',
    //     }
    //   : `${apolloConfig.graphId}@${apolloConfig.graphVariant}`,
    includes: ['./app/**/*.ts{,x}', './src/**/*.ts{,x}'],
    excludes: ['**/__tests__/**', 'graphql/**', './node_modules/**', '*'],
  },

  // service: {
  //   localSchemaFile: 'http://localhost:3000/graphql',
  // },
};
