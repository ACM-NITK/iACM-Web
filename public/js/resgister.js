function emailRegister() {
    email = document.getElementById('registerEmail').value;
    password = document.getElementById('registerPassword').value;
    name = document.getElementById('registerName').value;
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
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
            var ref = firebase.database().ref("Leader Board/" + user.uid);
            var arr = { 'admin': 'F', 'email': user.email, 'person_name': name, 'points': 0, 'streak': 0, 'uID': user.uid };
            ref.set(arr);
            window.location = 'loggedIn.html';
        }
    });
}
