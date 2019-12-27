function approveAttendance(f) {
    var ids = f.split('!');
    //console.log(ids);
    document.getElementById(f).className = 'list-group-item list-group-item-action active'
    var oldRef = firebase.database().ref('Events/' + ids[0] + '/Attendees/' + ids[1]);
    var newRef = firebase.database().ref('Events/' + ids[0] + '/Attended/' + ids[1]);
    moveFbRecord(oldRef, newRef);
    alert("Attendance marked");
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
