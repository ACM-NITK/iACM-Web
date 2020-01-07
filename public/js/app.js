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
            setTimeout(function () {
                window.location = 'loggedIn.html';
            }, 1500);

        }
    });
}

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

function passwordReset() {
    resetEmail = document.getElementById('resetEmail').value;
    firebase.auth().sendPasswordResetEmail(resetEmail).then(function () {
        alert('Password reset link sent to email');
    }).catch(function (error) {
        var errorMessage = error.message;
        alert(errorMessage);
    });
}

function requestAttendancePageLoad() {
    var dbRef = firebase.database().ref('Events');
    dbRef.once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            var selecRef = firebase.database().ref('Events/' + childKey);
            selecRef.once("value").then(function (snapshot) {
                var eventx = snapshot.val();
                var f = 0;
                var eventx2 = eventx.Attendees;
                for (var propName in eventx2) {
                    propValue = eventx2[propName];
                    if (firebase.auth().currentUser.uid == propName)
                        f = 1;
                }

                if (eventx.Attendees == undefined)
                    document.getElementById("event-list-group").innerHTML += '<button type="button" style="text-align:center;" id=' + childKey + ' class="list-group-item list-group-item-action" onclick="requestAttendance(\'' + childKey + '\')">' + childData.title + '</button>';
                else if (f == 1) {
                    document.getElementById("event-list-group").innerHTML += '<button type="button" style="text-align:center;" id=' + childKey + ' class="list-group-item list-group-item-action active" onclick="alert(\'Attendance already requested\')">' + childData.title + '</button>';
                }
                else {
                    document.getElementById("event-list-group").innerHTML += '<button type="button" style="text-align:center;" id=' + childKey + ' class="list-group-item list-group-item-action" onclick="requestAttendance(\'' + childKey + '\')">' + childData.title + '</button>';
                }
                var eventx3 = eventx.Attended
                console.log(eventx3);
                f = 0;
                for (var propName in eventx3) {
                    propValue = eventx3[propName];
                    if (firebase.auth().currentUser.uid == propName)
                        f = 1;
                }
                if (f == 1) {
                    document.getElementById(childKey).setAttribute('class', "list-group-item list-group-item-success");
                    document.getElementById(childKey).setAttribute('style', "text-alignment:left;");
                    document.getElementById(childKey).setAttribute('onclick', 'alert(\'Attendance already granted\')')
                }
            });
        });
    });
}

function requestAttendance(f) {
    var user = firebase.auth().currentUser;
    var dbRef = firebase.database().ref('Events/' + f + '/Attendees/' + user.uid);
    var ref = firebase.database().ref("Leader Board/" + user.uid);
    ref.once("value").then(function (snapshot) {
        var userX = snapshot.val();
        var arr = { 'aID': user.uid, 'attended': 'Appeal', 'name': userX.person_name, 'points': 0 };
        dbRef.set(arr);
        alert("Attendance Requested");
        document.getElementById(f).className = 'list-group-item list-group-item-action active';
    });
}

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
            document.getElementById("editprofile").style.visibility = "visible";
            user = firebase.auth().currentUser;
            firebase.database().ref("Leader Board/" + user.uid + "/person_name").once('value', function (snapshot) {
                document.getElementById('profileUserName').innerHTML = snapshot.val();
            })
            clearInterval(interv);
        }
        else {
            //document.getElementById('dummy').innerHTML = '';
            document.getElementById("editprofile").style.visibility = "hidden";
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


function approveAttendancePageLoad() {
    var dbRef = firebase.database().ref('Events');
    dbRef.once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            firebase.database().ref('Events/' + childKey).once('value', function (snapshot) {
                //console.log(snapshot.val());
                //console.log(resolve('Attendees.D8dOkDN2NZZRI0hZVNcUD0U1l7m2.name',snapshot.val()))
                var arr = []
                snapshot.forEach(function (childSnapshot2) {
                    var childKey2 = childSnapshot2.key;
                    var childData2 = childSnapshot2.val();
                    if (childKey2 == 'eID')
                        arr.push(childData2);
                    if (childKey2 == 'title')
                        arr.push(childData2);
                    if (childKey2 == 'Attendees')
                        arr.push(Object.getOwnPropertyNames(childData2));
                    if (arr.length == 3) {
                        console.log(arr)
                        var label = document.createElement("EventHolder");
                        var event_name = document.createElement("EventName");
                        event_name.className = 'list-group-item list-group-item-dark'
                        event_name.innerHTML = arr[2]
                        label.appendChild(event_name)
                        var event_attendees = document.createElement("EventAttendees")
                        arr[0].forEach(function (item, index) {
                            var str = 'Attendees.' + item + '.name'
                            //console.log(resolve(str,snapshot.val()))
                            event_attendees.innerHTML += '<button class=\'list-group-item list-group-item-action\' id=\'' + arr[1] + '!' + item + '\' onclick=approveAttendance(\'' + arr[1] + '!' + item + '\')>' + resolve(str, snapshot.val()) + '</button>';
                            //console.log(arr[1])
                        })
                        label.appendChild(event_attendees)
                        label.innerHTML += '<br>'
                        document.getElementById('event-list-group').appendChild(label)
                        arr = []
                    }
                })
            })
        })
    })
}

function approveAttendance(f) {
    var ids = f.split('!');
    //console.log(ids);
    document.getElementById(f).className = 'list-group-item list-group-item-action active'
    var oldRef = firebase.database().ref('Events/' + ids[0] + '/Attendees/' + ids[1]);
    var newRef = firebase.database().ref('Events/' + ids[0] + '/Attended/' + ids[1]);
    moveFbRecord(oldRef, newRef);
    alert("Attendance marked");
}

function leaderboardLoad() {
    i = 0
    var x = [];
    var ref = firebase.database().ref("Leader Board/");
    ref.once("value").then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            //console.log(childData.person_name, childData.points);
            m = { 'name': childData.person_name, 'points': childData.points, 'uid': childData.uID }
            x.push(m);
        });
    });
    setTimeout(function () {
        user = firebase.auth().currentUser;
        //console.log(user)
        //console.log(x);
        x.sort(function (a, b) { return b.points - a.points });
        for (i = 0; i < x.length; i++) {
            if (user.uid == x[i].uid) {
                document.getElementById('pointsTable').innerHTML += '<tr class=\'bg-success\'><th scope="row">' + (i + 1) + '</th><td>' + x[i].name + '</td><td>' + x[i].points + '</td></tr>';

            }
            else {
                document.getElementById('pointsTable').innerHTML += '<tr><th scope="row">' + (i + 1) + '</th><td>' + x[i].name + '</td><td>' + x[i].points + '</td></tr>';
            }
        }
    }, 3000);
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

function editProfile() {
    var user = firebase.auth().currentUser;
    if(user==NULL) {
        document.getElementById("editprofile").style.visibility="hidden";
    }
    else {
        document.getElementById("editprofile").style.visibility="visible";
    }
}

function changeName() {
    var newName = document.getElementById("loginName");
    var user = firebase.auth().currentUser;
    user.updateProfile({
        displayName:newName
    }).then(function() {
        console.log("Name changed successfully!")
    }, function(error) {
        console.log("Error")
    });
}