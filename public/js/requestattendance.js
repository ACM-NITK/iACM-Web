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
