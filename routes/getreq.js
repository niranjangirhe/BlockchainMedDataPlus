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
        var user = firebase.auth().currentUser;
        if (user != null) {
            console.log(firebase.auth().currentUser.email + firebase.auth().currentUser.displayName)
            if (firebase.auth().currentUser.displayName == "Doc") {
                const dbRef = firebase.database().ref();
                dbRef.child("user").child("Doctors").child(user.uid).get().then((snapshot) => {
                    if (snapshot.exists()) {
                        console.log("Doc data");
                        res.redirect("/addreport")
                    } else {
                        console.log("No Doc data");
                        res.redirect("/Doctordetail")
                    }
                }).catch((error) => {
                    console.error(error);
                });
                // res.redirect("/Doctordetail")
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

router.post('/docterDetails', (req, res) => {
    //update data to firebase
    const user = firebase.auth().currentUser;

    if (user) {
        firebase.database().ref('user/Doctors').child(user.uid).set({

            LicId: req.body.lisenceid,
            DocName: req.body.dcname,
            DcSpecaility: req.body.dcspeciality
        });
    }else{
        res.send("No user found");
    }
})

router.post('/patientdetails', (req, res) => {

    let UID = firebase.auth().currentUser.uid;
    console.log("UID: " + UID);
    firebase.database().ref('user/Patient').child(UID).set({
        Name: req.body.pname1,
        DOB: req.body.pdb1,
        PhoneNo: req.body.phno1,
        Gender: req.body.gender1,
        Address: req.body.paddr1,
        AdharNo: req.body.padhar1,
        Med_history: req.body.pmedhis1

    });
})
module.exports = router;