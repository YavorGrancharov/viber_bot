const ResponseMessage = Object.freeze({
  PLEASE_TYPE_HI: "Please type 'Hi' to see BTC and ETH buttons.",
  APP_RUNNING_ON_PORT: 'Application running on port',
  MISSING_BOT_ACCOUNT_KEY: 'Could not find bot account token key.',
  CANNOT_SET_WEBHOOK: 'Can not set webhook on following server.',
  EXPRESS_READY: 'Express ready!',
  MONGODB_READY: 'MongoDB ready!',
  DATABASE_ERROR: 'Database error: ',
  BOT_NAME: 'Finance Bot',
  WELCOME_TO_FINANCE_BOT:
    'Welcome to finance bot a place where you can get info about BTC and ETH prices.\nPlease choose your language from buttons below.',
});

module.exports = { ResponseMessage };
