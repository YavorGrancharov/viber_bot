const BotEvents = require('viber-bot').Events;

const botController = require('../../src/controllers/botController');
const bot = require('../../src/config/bot')();

bot.on = jest.fn();

describe('botController.onConversationStarted', () => {
  it('Should have an onConversationStarted function', () => {
    expect(typeof botController.onConversationStarted).toBe('function');
  });
  it('Should call bot.on event', () => {
    botController.onConversationStarted();
    bot.on(BotEvents.CONVERSATION_STARTED, () => {
      expect(bot.sendMessage).toBeCalled();
    });
  });
});
