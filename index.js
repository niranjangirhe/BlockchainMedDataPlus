const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const firebase = require('firebase');




app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//setting Public directory

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
// SET OUR VIEWS AND VIEW ENGINE

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/', require('./routes/getreq'));



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
    res.render('index')
})

app.get('/login',(req,res)=>{
    res.render('login')
})

app.get('/signup',(req,res)=>{
    res.render('signup')
})
const port = process.env.PORT || 4000
app.listen(port, () => console.log("Server is Running...",port));