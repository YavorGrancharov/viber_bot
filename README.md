# viber-bot

### Create Viber Public Account
https://partners.viber.com/account/create-bot-account

### Developer Documentation
> https://developers.viber.com/docs/

> Node.JS Bot API =>
https://developers.viber.com/docs/api/nodejs-bot-api/

#### For Node.JS,

Create a file **.env** in **main** directory and add this below text
```
VIBER_ACCESS_TOKEN=Your Viber Access Token Add HERE
MONGODB_URI=Your Mongo DB Connection String Add Here
PORT=3000
```

#### For local testing

Clone project with
```
git clone https://github.com/YavorGrancharov/viber_bot.git
```

#### Install all dependencies with 

```
npm install
```

Then, inside **index.js** file, replace this block of code:
```js
app.listen(settings.port, async () => {
  try {
    console.log(`Application running on port: ${settings.port}`);
    bot.setWebhook(`https://vbr-bot.herokuapp.com/viber/webhook`);
  } catch (error) {
    console.log('Can not set webhook on following server.');
    console.error(error);
    process.exit(1);
  }
});
```
with this one:
```js
app.listen(settings.port, async () => {
  try {
    const publicUrl = await ngrok.getPublicUrl();
    console.log(`Application running on port: ${settings.port}`);
    console.log('publicUrl => ', publicUrl);
    bot.setWebhook(`${publicUrl}/viber/webhook`);
  } catch (error) {
    console.log('Can not set webhook on following server.');
    console.error(error);
    process.exit(1);
  }
});
```
And run project using commands **npm run ngrok** and **npm run start**
