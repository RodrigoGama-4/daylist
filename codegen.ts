import type { CodegenConfig } from '@graphql-codegen/cli';
import fs from 'fs';

const schemaURL =
  // TODO after vercel deploy
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:3000/graphql' // ? 'graphql/schemas/**/*.ts'
    : 'davi-alexandres-team-rsnxw@main'; // : 'https://daylist-todo.vercel.app/graphql';

const config: CodegenConfig = {
  overwrite: true,
  schema: schemaURL,
  documents: [
    'app/**/*.{ts,tsx,gql,graphql,}',
    // deixar aqui, senão o watcher não atualiza ao salvar
    'graphql/{schemas,resolvers,}/**/*.{ts,tsx,gql,graphql}',
  ],
  generates: {
    'graphql/types/': {
      preset: 'client',
      plugins: [
        // 'typescript', // gives a duplication error in /graphql/types/graphql.ts
        'typescript-resolvers',
      ],
    },
  },
  watch: true,
  hooks: {
    afterAllFileWrite: reloadApolloExtension,
  },
};

function reloadApolloExtension() {
  const p = './apollo.config.js';
  fs.writeFileSync(p, fs.readFileSync(p));
}

export default config;
