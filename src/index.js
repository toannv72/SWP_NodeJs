const path = require('path')
const express = require('express');
const routes = require('./routes');
const morgan = require('morgan');
var bodyParser = require('body-parser');
const app = express()
const cookieParser = require('cookie-parser')
const port = 5000
const db = require('./config/db')
const cors = require("cors");

db.Connect()
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     next();
//   });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources'));
  
app.use(cookieParser());

app.use(morgan('combined'))

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

routes(app);

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})
