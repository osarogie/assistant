module.exports = {
  presets: [['next/babel', { 'styled-jsx': { optimizeForSpeed: false } }]],
  plugins: [
    ['react-native-web', { commonjs: true }],
    ['import', { libraryName: 'antd', style: 'css' }],
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          'react-native': 'react-native-web'
        }
      }
    ]
  ]
}
