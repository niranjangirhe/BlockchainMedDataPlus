if (window.location.hostname == "openelectiveallocation.web.app" || 
    window.location.hostname == "openelectiveallocation.firebaseapp.com") {
       window.location.href = '/404.html'; 
}
const Auth = firebase.auth()
//Signup
async function signup(e) {
    e.preventDefault()
    const email = document.getElementById("signinemail")
    const password = document.getElementById("signinpassword");
    const isDoc = document.getElementById("isDoc");
    try {
        var progress = document.getElementById("signinprogress");
        var btn = document.getElementById("signinbtn");
        progress.style.visibility = "visible";
        btn.style.visibility = "hidden";
        const result = await Auth.createUserWithEmailAndPassword(email.value, password.value)

        if(isDoc.checked)
        {
            await result.user.updateProfile({
                displayName: "Doc"
            });
        }
        else
        {
            await result.user.updateProfile({
                displayName: "User"
            });
        }
        
        
        // await firebase.firestore().collection("studentprefs").doc(PRN.value).set({
        //     email: email.value,
        //     mypref: [],
        //     School: document.getElementById("school").innerHTML.slice(7)
        // })
        //     .then(() => {
        //     })
        //     .catch((error) => {
        //         console.error("Error adding Data in database: ", error);
        //     });
        email.value = ""
        password.value = ""
        progress.style.visibility = "hidden";
        btn.style.visibility = "visible";
        window.alert("Signup successful.\nPlease check your inbox to verify your email id")
        window.location.href = "/login.html";
        sendVerificationEmail()
    }
    catch (err) {
        if (err.code == "auth/email-already-in-use") {
            err.message = "Email already exist"
        }
        window.alert(err.message);
        progress.style.visibility = "hidden";
        btn.style.visibility = "visible";
    }
}
const sendVerificationEmail = () => {

    Auth.currentUser.sendEmailVerification()
        .then(() => {
            console.log('Verification Email Sent Successfully !');
        })
        .catch(error => {
            console.error(error);
        })
}






//Login
async function login(e) {
    e.preventDefault()
    const email = document.getElementById("loginemail");
    const password = document.getElementById("loginpassword");
    try {
        var progress = document.getElementById("loginprogress");
        var btn = document.getElementById("login");
        progress.style.visibility = "visible";
        btn.style.visibility = "hidden";
        const result = await Auth.signInWithEmailAndPassword(email.value, password.value)
        if (!Auth.currentUser.emailVerified) {
            sendVerificationEmail()
            throw {
                message: "Email Id not verified.\nPlease check your inbox for verification email",
                error: new Error()
            };
        }
        if(Auth.currentUser!=null)
        {
            console.log("HI Niranjan")
        }

        email.value = ""
        password.value = ""
        progress.style.visibility = "hidden";
        btn.style.visibility = "visible";
        if (Auth.currentUser.displayName == "Doc") {
            window.location.href = "/addreport.html";
        }
    }
    catch (err) {
        if (err.code == "auth/wrong-password") {
            err.message = "Incorrect Password"
        }
        if (err.code == "auth/user-not-found") {
            err.message = "Email does not exist, Please sign-up"
        }
        window.alert(err.message)
        progress.style.visibility = "hidden";
        btn.style.visibility = "visible";
    }
}


//log out
function logout() {
    Auth.signOut().then(() => {
        window.alert("Logout successfull")
    }).catch((error) => {
        window.alert(error.message)
    });
}





//check if loggedin
Auth.onAuthStateChanged((user) => {
    if (user && Auth.currentUser.emailVerified) {
        if (Auth.currentUser.displayName == "Doc") {
            window.location.href = "/addreport.html";
        }
    }
    if (!user || !Auth.currentUser.emailVerified) {
        if (!(window.location.href.slice(-10) == "login.html" || window.location.href.slice(-11) == "signup.html" || window.location.href.slice(-10) == "reset.html")) {
            window.location.href = "/login.html";
        }
    }
});


//forget Password
function forgotpass(e) {
    e.preventDefault()
    var emailAddress = document.getElementById("studresetemail").value;
    var progress = document.getElementById("resetprogress");
    var btn = document.getElementById("forgotbtn");
    progress.style.visibility = "visible";
    btn.style.visibility = "hidden";

    Auth.sendPasswordResetEmail(emailAddress).then(function () {
        window.alert("Reset Link sent")
        progress.style.visibility = "hidden";
        btn.style.visibility = "visible";
    }).catch(function (error) {
        window.alert(error.message)
        progress.style.visibility = "hidden";
        btn.style.visibility = "visible";
    });
}