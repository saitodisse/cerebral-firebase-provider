import * as tt from 'typescript-definition-tester'

export function compileDirectory(done) {
  tt.compileDirectory(__dirname, (fileName) => fileName.match(/\.ts$/), done)
}
