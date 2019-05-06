require('dotenv').config();

const app = require('./app');
const { connectDb } = require('./lib/mongo');
connectDb(process.env.DB_URL, true, err => {
    if (err) throw err;
    app.listen(process.env.PORT, process.env.HOST, () => {
        console.log(`Server listening on http://${process.env.HOST}:${process.env.PORT}`);
    });
});