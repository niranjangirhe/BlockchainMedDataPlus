const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const path = require('path');
const { append } = require('vary');

const firebaseConfig = {
    apiKey: "AIzaSyB6i_CTLfQh3vpBwV59sHxASXKSAf9wwB4",
    authDomain: "med-data-plus.firebaseapp.com",
    projectId: "med-data-plus",
    storageBucket: "med-data-plus.appspot.com",
    messagingSenderId: "772756370856",
    appId: "1:772756370856:web:b69242c1dc4e9f66ba599d"
};
firebase.initializeApp(firebaseConfig);

router.post('/login', (req, res) => {
    
    firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password).then(() => {
        res.redirect('/');
    }).catch((error) => {
        res.send(error.message);
    });
});

router.post('/signup', (req, res) => {
    
    firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password).then(() => {
        res.redirect('/login');
    }).catch((error) => {
        res.send(error.message);
    });
});

router.get('/reset',(req,res)=>{
    
})

module.exports = router;