function sendPasswordChangeEmail() {
    var auth = firebase.auth();
    var emailAddress = auth.currentUser.email;
    auth.sendPasswordResetEmail(emailAddress).then(function () {
        alert('Email sent with reset instructions.')
    }).catch(function (error) {
        alert(error);
    });
}

function adminCheck() {
    var user = firebase.auth().currentUser;
    var ref = firebase.database().ref("Leader Board/" + user.uid);

    ref.once("value").then(function (snapshot) {
        var userX = snapshot.val();
        if (userX.admin == 'F')
            alert('You do not have administrator privileges');
        else
            window.location = 'adminPortal.html';
    });
}

function userLogout() {
    var user = firebase.auth().currentUser;
    firebase.auth().signOut().then(function () {
    }).catch(function (error) {
    });
}

function checkUser() {
    var user;
    var t = 0;
    var temp;
    //temp = document.getElementById('dummy').innerHTML;
    var interv = setInterval(function () {
        user = firebase.auth().currentUser;
        t++;
        if (user != null) {
            document.getElementById('dummy').style.visibility = 'visible';
            user = firebase.auth().currentUser;
            firebase.database().ref("Leader Board/" + user.uid + "/person_name").once('value', function (snapshot) {
                document.getElementById('profileUserName').innerHTML = snapshot.val();
            })
            clearInterval(interv);
        }
        else {
            //document.getElementById('dummy').innerHTML = '';
            if (t == 1000) {
                clearInterval(interv);
            }
        }
    }, 1);
}

function userLogout() {
    var user = firebase.auth().currentUser;
    firebase.auth().signOut().then(function () {
    }).catch(function (error) {
    });
}
