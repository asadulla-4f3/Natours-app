/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');

const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message, 'unhandled rejection err');
  console.log('UNHANDLED REJECTION! 💥 SHUTTING DOWN...');
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then(() => {
  console.log('DB connection successful');
});

const port = process.env.PORT || 3000;
const server = app.listen(port, '127.0.0.1', () => {
  console.log(`App running on port ${port}....`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message, 'unhandled rejection err');
  console.log('UNHANDLED REJECTION! 💥 SHUTTING DOWN...');
  server.close(() => {
    process.exit(1);
  });
});
