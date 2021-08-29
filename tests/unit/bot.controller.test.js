const BotEvents = require('viber-bot').Events;

const botController = require('../../src/controllers/bot.controller');
const bot = require('../../src/config/bot.config')();

bot.on = jest.fn();
bot.sendMessage = jest.fn();

beforeAll(() => {
  botController.onConversationStarted(bot);
});

describe('botController.onConversationStarted', () => {
  it('Should have an onConversationStarted function', () => {
    expect(typeof botController.onConversationStarted).toBe('function');
  });
  it('Should call bot.on event', () => {
    expect(bot.on).toBeCalled();
  });
  it('Should call bot.sendMessage function', () => {
    bot.on(BotEvents.CONVERSATION_STARTED, () => {
      expect(bot.sendMessage).toBeCalled();
    });
  });
  it('Should verify response object', () => {
    bot.on(BotEvents.CONVERSATION_STARTED, (response) => {
      expect(response).toHaveProperty('userProfile');
    });
  });
});
