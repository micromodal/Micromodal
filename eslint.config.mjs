import neostandard from 'neostandard'

export default [
  ...neostandard(),
  {
    rules: {
      'template-curly-spacing': ['error', 'always'],
      quotes: [2, 'single', { avoidEscape: true }]
    }
  }
]
