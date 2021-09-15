// const i18n = require('../../i18n.config');

// const localeService = (i18nProvider) => {
//   this._i18n = i18nProvider;

//   return {
//     getLocale: () => {
//       return this._i18n.getLocale();
//     },
//     getLocales: () => {
//       return this._i18n.getLocales();
//     },
//     setLocale: (locale) => {
//       if (this._i18n.getLocales().indexOf(locale) !== -1) {
//         return this._i18n.setLocale(locale);
//       }
//     },
//     translate: (string, args = undefined) => {
//       return this._i18n.__(string, args);
//     },
//     translatePlurals: (phrase, count) => {
//       return this._i18n.__n(phrase, count);
//     },
//   };
// };

// module.exports = Object.freeze(localeService(i18n));

const en = require('../../locales/en.json');
const bg = require('../../locales/bg.json');

module.exports = {
  setLocale: (locale) => {
    const locales = ['en', 'bg'];
    if (locales.indexOf(locale) !== -1) {
      process.env.LOCALE = locale;
    }
  },
  translate: (locale, key, replacement = { name: '', value: '' }) => {
    let locales = Object.assign({ en, bg }, en, bg);
    let translated;
    if (locales[locale]) {
      const regex = /\%(.*?)\%/g;
      let placeholders = locales[locale][key].match(regex);
      if (placeholders !== null) {
        placeholders.forEach((placeholder, index) => {
          let replace = placeholder.substring(1, placeholder.length - 1);
          translated = locales[locale][key].replace(
            placeholder,
            replacement[replace]
          );
        });
      }
      console.log(translated)
      return translated;
    }
  },
};
