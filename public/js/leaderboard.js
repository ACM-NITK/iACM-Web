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
