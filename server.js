const express = require('express');
const connectDb = require('./config/db');
const path = require('path');
var cors = require('cors');

const app = express();

//Connect Database
connectDb();

app.use(express.json({extended: false}));
app.use(cors());

// app.get('/', (req, res) => res.send('API running'))

//Define Routes
app.use('/api/users', require('../ReactApp/routes/RoutesApi/users'));
app.use('/api/auth', require('./routes/RoutesApi/auth'))
app.use('/api/posts', require('./routes/RoutesApi/posts'))
app.use('/api/profile', require('./routes/RoutesApi/profile'))

//Serve static assets in production
if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendfile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
//hiroku first will check process.env.PORT.. 

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))
