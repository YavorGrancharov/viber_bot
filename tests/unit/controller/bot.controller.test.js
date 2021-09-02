const botController = require('../../../src/controllers/consolidator').bot;
const bot = require('../../../src/config/bot.config')();

bot.on = jest.fn();
bot.sendMessage = jest.fn();

beforeAll(() => {
  botController.onConversationStarted(bot);
});

describe('Test: botController.onConversationStarted', () => {
  it('onConversationStarted should be a function', () => {
    expect(typeof botController.onConversationStarted).toBe('function');
  });
});

describe('Test: botController.onMessageReceived', () => {
  it('Should have an onMessageReceived function', () => {
    expect(typeof botController.onMessageReceived).toBe('function');
  });
});
