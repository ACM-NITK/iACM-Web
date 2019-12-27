function passwordReset() {
    resetEmail = document.getElementById('resetEmail').value;
    firebase.auth().sendPasswordResetEmail(resetEmail).then(function () {
        alert('Password reset link sent to email');
    }).catch(function (error) {
        var errorMessage = error.message;
        alert(errorMessage);
    });
}
