const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
    // userNewUrlParser: true
    // useUnifiedTopolofy: true
    // useFindAndModify: true,
    // useCreateIndex: true
})
    .then(() => {
        console.log('Mongo DB is connected.');
    })
    .catch((err) => {
        console.log('Mongo DB Error: ', err.message);
    });

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB.');
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose Error: ', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected.');
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});