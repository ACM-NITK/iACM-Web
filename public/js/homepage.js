function emailLogin() {
    email = document.getElementById('loginEmail').value;
    password = document.getElementById('loginPassword').value;
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
        } else {
            alert(errorMessage);
        }
    });
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            window.location.assign('iACM/loggedIn.html');
        }
    });
}


function checkUserLogin() {
    var user;
    var t = 0;
    var temp;
    var interv = setInterval(function () {
        user = firebase.auth().currentUser;
        t++;
        if (user != null) {
            window.location = 'iACM/loggedIn.html';
            clearInterval(interv);
        }
        else {
            if (t == 1000) {
                document.getElementById('dummy').style.visibility = 'visible';
                clearInterval(interv);
            }
        }
    }, 1);
}
