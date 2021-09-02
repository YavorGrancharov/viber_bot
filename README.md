![example workflow](https://github.com/YavorGrancharov/viber_bot/actions/workflows/tests.yml/badge.svg)
![CodeQL scan](https://github.com/YavorGrancharov/viber_bot/actions/workflows/codeql.yml/badge.svg)
[![CircleCI](https://circleci.com/gh/YavorGrancharov/viber_bot/tree/main.svg?style=svg)](https://circleci.com/gh/YavorGrancharov/viber_bot/tree/main)
![Total lines](https://sloc.xyz/github/YavorGrancharov/viber_bot)
![Website](https://img.shields.io/website?down_color=red&down_message=down&up_color=green&up_message=up&url=https%3A%2F%2Fvbr-bot.herokuapp.com%2F)

# viber-bot

#### Software Requirements

-   Viber Bot **1.0+**
-   Node.js **14+**
-   MongoDB **4.0+**
-   Mongoose **5.13+**
-   Bootstrap **5.1+**
-   Express.js **4.17+**

#### Project  structure
```sh
.
├── app.js
├── package.json
├── package-lock.json
├── README.md
├── .gitignore
├── i18n.config.js
├── idle.js
├── jest.config.js
├── Procfile
├── publicUrl.js
├── scheduler.js
└── .circleci
│   |   └── config.yml
└── .github
│   ├── workflows
│   |   ├── codeql.yml
│   |   └── tests.yml
└── locales
│   ├── api
│   |   └── users.js
└── src
│   └── api
│   |   ├── crypto.api.js
│   |   └── users.api.js
│   └── config
│   |   ├── bot.config.js
│   |   ├── database.config.js
│   |   ├── express.config.js
│   |   ├── router.config.js
│   |   └── settings.config.js
│   └── constants
│   |   ├── request.headers.js
│   |   ├── request.message.js
│   |   ├── request.method.js
│   |   ├── request.url.js
│   |   └── response.message.js
│   └── controllers
│   |   ├── bot.controller.js
│   |   ├── consolidator.js
│   |   ├── event.controller.js
│   |   └── msg.controller.js
│   └── helpers
│   |   ├── common.ops.helper.js
│   |   └── request.helper.js
│   └── models
│   |   ├── bitcoin.model.js
│   |   ├── ethereum.model.js
│   |   └── user.model.js
│   ├── msgJsonTemplates
│   |   ├── keyboard.message.json
│   |   ├── rich-media.message.json
│   |   └── welcome.message.json
│   ├── services
│   |   └── locale.service.js
└── static
│   ├── images
│   └── styles
└── tests
│   ├── mock
│   ├── unit
│   └── integration
└── views
    ├── home
    └── layouts
```

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
WEBHOOK_URL=Your Heroku URL like https://yourappname.herokuapp.com
PORT=3000
```

#### For local testing

Install **ngrok** globally with command

```
npm install -g ngrok
```

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
    bot.setWebhook(`${process.env.WEBHOOK_URL}/viber/webhook`);
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
    const publicUrl = await getPublicUrl();
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
And run project using commands **npm run ngrok** and **npm run start** on two separate terminals

You can see it running on **localhost:3000**

#### Run all tests with command

```
npm run test
```

#### Technology Stack

-   [Express](https://expressjs.com/)
-   [Node](https://nodejs.org)
-   [Viber Bot](https://developers.viber.com/docs/api/nodejs-bot-api/)
-   [i18n](https://github.com/mashpie/i18n-node)
-   [Mongoose](https://mongoosejs.com/)
-   [MongoDB](https://www.mongodb.com/)
-   [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
-   [Handlebars](https://handlebarsjs.com/)
-   [Bootstrap](https://getbootstrap.com/)

#### Contributors
<a href="https://github.com/YavorGrancharov/viber_bot/graphs/contributors">
<img src="https://contrib.rocks/image?repo=YavorGrancharov/viber_bot"/>
</a>
