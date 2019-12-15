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
