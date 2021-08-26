const ResponseMessage = Object.freeze({
  TEXT_MESSAGE_ONLY: 'Sorry. I can only understand text messages.',
  PLEASE_TYPE_HI: "Please type 'Hi' to see BTC and ETH buttons.",
  APP_RUNNING_ON_PORT: 'Application running on port',
  MISSING_BOT_ACCOUNT_KEY: 'Could not find bot account token key.',
  CANNOT_SET_WEBHOOK: 'Can not set webhook on following server.',
  EXPRESS_READY: 'Express ready!',
  MONGODB_READY: 'MongoDB ready!',
  DATABASE_ERROR: 'Database error: ',
  CURRENT_BTC_PRICE: 'Current BTC price: ',
  CURRENT_ETH_PRICE: 'Current ETH price: ',
  BOT_NAME: 'Finance Bot',
  POSTMAN_KNOCKS_TWICE: 'Postman knocks twice.',
  YOU_HAVE_BEEN_SERVED: "You've been served!",
  WELCOME_TO_FINANCE_BOT:
    'Welcome to finance bot a place where you can get info about BTC and ETH prices.\nPlease choose you language from buttons below.',
});

module.exports = { ResponseMessage };
