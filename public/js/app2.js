function checkUser() {
    var user;
    var t = 0;
    var temp;
    temp = document.getElementById('dummy').innerHTML;
    var interv = setInterval(function () {
        user = firebase.auth().currentUser;
        t++;
        if (user != null) {
            document.getElementById('dummy').innerHTML = temp;
            user = firebase.auth().currentUser;
            clearInterval(interv);
        }
        else {
            document.getElementById('dummy').innerHTML = '';
            if (t == 1000) {
                clearInterval(interv);
            }
        }
    }, 1);
}
