// TODO(targos): replace this with adonisjs/require-ts

const babel = require('@babel/core');
const t = require('babel-types');
const tsJest = require('ts-jest');

exports.process = function testTransform(...args) {
  const transformedByTsJest = tsJest.process(...args);
  const transformedByBabel = babel.transformSync(transformedByTsJest, {
    plugins: [babel.createConfigItem(testPlugin)],
    sourceMaps: 'inline',
  });
  return transformedByBabel.code;
};

function testPlugin() {
  return {
    name: 'test-plugin',
    visitor: {
      CallExpression(path) {
        const { node } = path;
        if (
          t.isIdentifier(node.callee) &&
          node.callee.name === 'require' &&
          node.arguments.length === 1 &&
          node.arguments[0].type === 'StringLiteral'
        ) {
          const moduleName = node.arguments[0].value;
          if (moduleName.startsWith('@ioc:')) {
            path.replaceWithSourceString(
              `global[Symbol.for('ioc.use')]('${moduleName.substr(5)}')`,
            );
          }
        }
      },
    },
  };
}
