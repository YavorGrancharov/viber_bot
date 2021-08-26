const i18n = require('../../i18n.config');

const localeService = (i18nProvider) => {
  this._i18n = i18nProvider;

  return {
    getLocale: () => {
      return this._i18n.getLocale();
    },
    getLocales: () => {
      return this._i18n.getLocales();
    },
    setLocale: (locale) => {
      if (this._i18n.getLocales().indexOf(locale) !== -1) {
        return this._i18n.setLocale(locale);
      }
    },
    translate: (string, args = undefined) => {
      return this._i18n.__(string, args);
    },
    translatePlurals: (phrase, count) => {
      return this._i18n.__n(phrase, count);
    },
  };
};

module.exports = Object.freeze(localeService(i18n));
