import type { CodegenConfig } from '@graphql-codegen/cli';
import fs from 'fs';

const config: CodegenConfig = {
  overwrite: true,
  // usar arquivo e não localhost evita enlouquecer quando exclui graphql/types
  schema: 'graphql/schemas/**/*.{ts,tsx,gql,graphql}',
  documents: [
    // TODO uncomment to use types
    'app/**/*.{ts,tsx,gql,graphql,}',

    // deixar aqui, senão o watcher não atualiza ao salvar
    'graphql/**/*.{ts,tsx,gql,graphql}',
  ],
  generates: {
    'graphql/types/': {
      preset: 'client',
      plugins: [
        // 'typescript', // duplication error in /graphql/types/graphql.ts
        'typescript-resolvers',
      ],
    },
  },
  watch: true,
  hooks: {
    afterAllFileWrite: forceReloadApolloExtension,
  },
};

function forceReloadApolloExtension() {
  const p = './apollo.config.js';
  fs.writeFileSync(p, fs.readFileSync(p));
}

export default config;
