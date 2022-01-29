const express = require('express');
const firebase = require('firebase');
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
        if (firebase.auth().currentUser != null) {
            console.log(firebase.auth().currentUser.email + firebase.auth().currentUser.displayName)
            if (firebase.auth().currentUser.displayName == "Doc") {
                res.redirect("/Doctordetail")
            }
            else {
                res.redirect("/Addpatient")
            }
        }
    }).catch((error) => {
        res.send(error.message);
    });
});

router.get('/logout', (req, res) => {

    firebase.auth().signOut().then(() => {
        res.redirect('/login');
    }).catch((error) => {
        res.send(error.message);
    });
});

router.post('/signup', (req, res) => {
    if (req.body.password === req.body.cpassword) {
        firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password).then(() => {
            if (req.body.usertype == "doctor") {
                firebase.auth().currentUser.updateProfile({
                    displayName: "Doc"
                }).then(() => {
                    res.redirect('/login');
                }).catch((error) => {
                    // An error occurred
                    // ...
                });
            }
            else {
                firebase.auth().currentUser.updateProfile({
                    displayName: "User"
                }).then(() => {
                    res.redirect('/login');
                }).catch((error) => {
                    // An error occurred
                    // ...
                });
            }

        }).catch((error) => {
            res.send(error.message);
        });
    } else {
        console.log('Passwords do not match');
    }
});

router.post('/reset', (req, res) => {
    //reset password
    firebase.auth().sendPasswordResetEmail(req.body.email).then(() => {
        res.redirect('/login');
    }).catch((error) => {
        res.send(error.message);
    })
    console.log("Email sent");

})

router.get('/docterDetails', (req, res) => {
    //update data to firebase
    let UID = firebase.auth().currentUser.uid;
    console.log("UID: " + UID);
    // firebase.database().ref('user/Doctors').child(req.body.lisenceid).set({
        
    //     LicId: req.body.lisenceid,
    //     DocName: req.body.dcname,
    //     DcSpecaility: req.body.dcspeciality
    // });
        
    
})
module.exports = router;