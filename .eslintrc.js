module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/airbnb'
  ],
  rules: {
    'no-console'                   : process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger'                  : process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-multi-spaces'              : 'off',
    'class-methods-use-this'       : 'off',
    'key-spacing'                  : 'off',
    'eol-last'                     : 'off',
    'brace-style'                  : 'off',
    'object-curly-newline'         : 'off',
    'no-underscore-dangle'         : 'off',
    'consistent-return'            : 'off',
    'padded-blocks'                : 'off',
    'no-plusplus'                  : 'off',
    'no-await-in-loop'             : 'off',
    'prefer-template'              : 'off',
    'operator-assignment'          : 'off',
    'no-param-reassign'            : 'off',
    'no-return-await'              : 'off',
    'arrow-body-style'             : 'off',
    'space-unary-ops'              : 'off',
    'radix'                        : 'off',
    'prefer-destructuring'         : 'off',
    'no-trailing-spaces'           : 'off',
    'prefer-promise-reject-errors' : 'off',
    'max-len'                      : 'off',
    'indent'                       : 'off',
    'no-multi-assign'              : 'off',
    'no-unneeded-ternary'          : 'off',
    'no-shadow'                    : 'off',
    'no-restricted-syntax'         : 'off',
    'no-mixed-operators'           : 'off',
    'object-shorthand'             : 'off',
    'import/no-extraneous-dependencies': 'off',
    'vue/no-parsing-error'         : [2, { "x-invalid-end-tag": false }]
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  globals: {
    __MIDDLEWARE__ : true,
    axios          : true,
    _              : true,
  },
}
