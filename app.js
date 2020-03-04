const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/order');
const morgan = require('morgan')
const cors = require('cors')
const app = express();
const keys = require('./config/keys');

mongoose.connect(keys.mongoURI)
    .then(()=>{ console.log('monobd connected')})
    .catch(()=>{ console.log('error')})
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.use(morgan('dev'))

app.use(cors())

app.use(passport.initialize())
require('./middleware/passport')(passport)
app.use('/api/auth', authRoutes)
app.use('/api/order', orderRoutes)
module.exports = app