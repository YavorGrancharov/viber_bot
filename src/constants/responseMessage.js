const ResponseMessage = Object.freeze({
  TEXT_MESSAGE_ONLY: 'Sorry. I can only understand text messages.',
  PLEASE_TYPE_HI: "Please type 'Hi' to see BTC and ETH buttons.",
  THANKS_FOR_SUBSCRIBING: 'Thanks for subscribing',
  APP_RUNNING_ON_PORT: 'Application running on port',
  MISSING_BOT_ACCOUNT_KEY: 'Could not find bot account token key.',
  CANNOT_SET_WEBHOOK: 'Can not set webhook on following server.',
  ANSWER_TO_EVERYTHING: 'The answer to everything is 42.',
  HELLO: 'Hello, I am ',
  EXPRESS_READY: 'Express ready!',
  MONGODB_READY: 'MongoDB ready!',
  DATABASE_ERROR: 'Database error: ',
  CURRENT_BTC_PRICE: 'Current BTC price: ',
  CURRENT_ETH_PRICE: 'Current ETH price: ',
  BOT_NAME: 'Finance Bot',
  POSTMAN_KNOCKS_TWICE: 'Postman knocks twice.',
  YOU_HAVE_BEEN_SERVED: 'You\'ve been served!',
});

module.exports = { ResponseMessage };
