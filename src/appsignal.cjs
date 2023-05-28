const { Appsignal } = require("@appsignal/nodejs");

new Appsignal({
  active: true,
  name: "track-errors-nodejs-apm",
  pushApiKey: process.env.APPSIGNAL_PUSH_API_KEY,
  environment: 'development',
});
