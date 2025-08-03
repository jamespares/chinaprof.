module.exports = {
  locales: ['en', 'zh'],
  defaultValue: (lng, ns, key) => key,
  keySeparator: false,
  nsSeparator: false,
  output: 'src/lib/i18n/locales/$LOCALE.json',
  createOldCatalogs: false,
  keepRemoved: false,
  lexers: {
    tsx: ['JsxLexer'],
    ts: ['JavascriptLexer']
  }
}
