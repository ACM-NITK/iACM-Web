function sendPasswordChangeEmail() {
    var auth = firebase.auth();
    var emailAddress = auth.currentUser.email;
    auth.sendPasswordResetEmail(emailAddress).then(function () {
        alert('Email sent with reset instructions.')
    }).catch(function (error) {
        alert(error);
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




function resolve(path, obj = self, separator = '.') {
    var properties = Array.isArray(path) ? path : path.split(separator)
    return properties.reduce((prev, curr) => prev && prev[curr], obj)
}

function moveFbRecord(oldRef, newRef) {
    oldRef.once('value', function (snap) {
        if (snap.val() != null) {
            newRef.set(snap.val(), function (error) {
                if (!error) { oldRef.remove(); }
                else if (typeof (console) !== 'undefined' && console.error) { console.error(error); }
            });
        }
    });
}
