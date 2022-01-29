const express = require('express');
const firebase = require('firebase');
const { request } = require('http');
const router = express.Router();
const path = require('path');
const { append } = require('vary');

const firebaseConfig = {
    apiKey: "AIzaSyB6i_CTLfQh3vpBwV59sHxASXKSAf9wwB4",
    authDomain: "med-data-plus.firebaseapp.com",
    databaseURL: "https://med-data-plus-default-rtdb.asia-southeast1.firebasedatabase.app",
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
    if(req.body.password === req.body.cpassword){
        firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password).then(() => {
            res.redirect('/login');
        }).catch((error) => {
            res.send(error.message);
        });
    }else{
        console.log('Passwords do not match');
    }   
});

router.post('/reset',(req,res)=>{
    //reset password
    firebase.auth().sendPasswordResetEmail(req.body.email).then(()=>{
        res.redirect('/login');
    }).catch((error)=>{
        res.send(error.message);
    })
    console.log("Email sent");
    
})

router.post('/docterDetails', (req, res) => {
    //update data to firebase

    firebase.database().ref('user/Doctors').child(req.body.lisenceid).set({
        
        LicId: req.body.lisenceid,
        DocName: req.body.dcname,
        DcSpecaility: req.body.dcspeciality
    });
        
    
})

router.post('/patientdetails',(req,res)=>{

    firebase.database().ref('user/Patient').child(req.body.phno1).set({
        
        Name: req.body.pname1,
        DOB: req.body.pdb1,
        PhoneNo: req.body.phno1,
        Gender:req.body.gender1,
        Address:req.body.paddr1,
        AdharNo:req.body.padhar1,
        Med_history:req.body.pmedhis1

    });
   
   

})
module.exports = router;