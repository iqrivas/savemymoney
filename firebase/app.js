var firebaseConfig = {
    apiKey: "AIzaSyDcQAqiwbRyVgR3WdezSj1hpQoLAuBGG4M",
    authDomain: "savemymoney-ec2ca.firebaseapp.com",
    projectId: "savemymoney-ec2ca",
    storageBucket: "savemymoney-ec2ca.appspot.com",
    messagingSenderId: "442520639107",
    appId: "1:442520639107:web:3bb6007192f315cd1c2db6",
    measurementId: "G-RSLY3QK3FH"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

class User {
    usersRef = db.collection('users');

    async getAll() {
    const users = [];

    try {
        let snapshot = await this.usersRef.get();
        snapshot.forEach(doc => users.push({id: doc.id, ...doc.data()}))
    } catch (err) {
        console.error('Error Getting USers: ', error)
    }
    
    console.log(users)
    
    return users;

    }
}

const userObj = new User();
console.log(userObj.getAll());


/* const userListUI = document.getElementById("userList");
 */
/* usersRef.on("child_added", snap => {
   let user = snap.val();
   let $li = document.createElement("li");
   $li.innerHTML = user.name;
   $li.setAttribute("child-key", snap.key); 
   $li.addEventListener("click", userClicked)
   userListUI.append($li);
});

function userClicked(e) {

    var userID = e.target.getAttribute("child-key");
  
    const userRef = db.child('users/' + userID);
  
    const userDetailUI = document.getElementById("userDetail");
    userDetailUI.innerHTML = ""
  
    userRef.on("child_added", snap => {
      var $p = document.createElement("p");
      $p.innerHTML = snap.key + " - " + snap.val()
      userDetailUI.append($p);
    });
  
  } */