import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: "AIzaSyCKB6xLamxvzPdXR7Z3-jg_5LBBjeBHAqk",
  authDomain: "beechenghiang.firebaseapp.com",
  databaseURL: "https://beechenghiang.firebaseio.com",
  projectId: "beechenghiang",
  storageBucket: "beechenghiang.appspot.com",
  messagingSenderId: "722500114470",
  appId: "1:722500114470:web:60ff9a6eaae707b516eee7",
  measurementId: "G-9XLHYW3H1W"
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.database();
  }

  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);  
  
  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);  

  doSignOut = () => this.auth.signOut();
  
  //doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
 
  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  // *** Merge Auth and DB User API ***
  onAuthUserListener = (next, fallback) =>
  this.auth.onAuthStateChanged(authUser => {
    if (authUser) {
      this.user(authUser.uid)
        .once('value')
        .then(snapshot => {
          const dbUser = snapshot.val();

          // default empty roles
          if (!dbUser.roles) {
            dbUser.roles = {};
          }

          // merge auth and db user
          authUser = {
            uid: authUser.uid,
            email: authUser.email,
            ...dbUser,
          };

          next(authUser);
        });
    } else {
      fallback();
    }
  });

  // *** User API ***
  user = uid => this.db.ref(`/users/${uid}`);
 
  users = () => this.db.ref('/users');

  doUpdateCurrentUserStatus = () => 
  this.auth.onAuthStateChanged(function(authUser) {
    if (authUser!=null) {
      console.log(authUser.uid);
      app.database().ref('/users/' + authUser.uid + '/').update({isNewUser: false});
      console.log("isNewUser updated to false!");
    } else {
      // No user is signed in.
    }
  });

  doUpdateAccountDetails = (username, contactNumber) => 
  this.auth.onAuthStateChanged(function(authUser) {
    if (authUser!=null) {
      console.log(authUser.uid);
      app.database().ref('/users/' + authUser.uid + '/').update({
        username: username,
        contactNumber: contactNumber
      });
      console.log("Account details updated!");
    } else {
      // No user is signed in.
    }
  });

  doUpdateSelectedFaultReport = (faultID, faultDescription, faultOutlet, faultStatus) => 
  this.auth.onAuthStateChanged(function(authUser) {
    if (authUser!=null) {
      console.log(authUser.uid);
      app.database().ref('/users/' + authUser.uid + `/faultReports/${faultID}`).update({
        faultID: faultID,
        faultDescription: faultDescription,
        faultOutlet: faultOutlet,
        faultStatus: faultStatus 
      });
      console.log("faultReport updated!");
    } else {
      // No user is signed in.
    }
  });

  doAssignSelectedFaultReport = (faultOwner, faultCategory, faultDescription, faultOutlet) => 
  this.auth.onAuthStateChanged(function(authUser) {
    if (authUser!=null) {
      var targetFaultIDtoDelete = '';
      var foundUserUID = false;
      console.log("Admin UID: " + authUser.uid);
      // look for the exact same fault report in entire db
      app.database().ref('/users')
      .once('value')
      .then(snapshot => {
        const usersObject = snapshot.val();
        const usersList = Object.keys(usersObject).map(key => ({
          ...usersObject[key],
          uid: key,
        }));
        for (var i=0; i<usersList.length; i++) {
          if (usersList[i].roles.hasOwnProperty("USER")) {
            if (usersList[i].hasOwnProperty("faultReports")) {
              for (var j=0; j<usersList[i].faultReports.length; j++) {
                if (usersList[i].uid === faultOwner
                    && usersList[i].faultReports[j].faultCategory === faultCategory
                    && usersList[i].faultReports[j].faultDescription === faultDescription
                    && usersList[i].faultReports[j].faultOutlet === faultOutlet) {
                      targetFaultIDtoDelete = usersList[i].faultReports[j].faultID;
                      foundUserUID = true;
                      break;
                    }
              }
            }
          }
          if (foundUserUID === true) {
            let ref = app.database().ref('/users/' + String(faultOwner) + `/faultReports/${targetFaultIDtoDelete}`);
            ref.update({
              assignedAdminUid: authUser.uid,
              isAssigned: true,
              faultStatus: "ONGOING" 
            });
            console.log("Fault Report assigned!");
            break;
          };
        }
      });
    } else {
      // No user is signed in.
    }
  });

  doUpdateSelectedFaultReportByAdmin = (isResolved, updates, faultOwner, faultCategory, faultDescription, faultOutlet) => 
  this.auth.onAuthStateChanged(function(authUser) {
    if (authUser!=null) {
      var targetFaultIDtoUpdate = '';
      var foundUserUID = false;
      console.log("Admin UID: " + authUser.uid);
      // look for the exact same fault report in entire db
      app.database().ref('/users')
      .once('value')
      .then(snapshot => {
        const usersObject = snapshot.val();
        const usersList = Object.keys(usersObject).map(key => ({
          ...usersObject[key],
          uid: key,
        }));
        for (var i=0; i<usersList.length; i++) {
          if (usersList[i].roles.hasOwnProperty("USER")) {
            if (usersList[i].hasOwnProperty("faultReports")) {
              for (var j=0; j<usersList[i].faultReports.length; j++) {
                if (usersList[i].uid === faultOwner
                    && usersList[i].faultReports[j].faultCategory === faultCategory
                    && usersList[i].faultReports[j].faultDescription === faultDescription
                    && usersList[i].faultReports[j].faultOutlet === faultOutlet) {
                      targetFaultIDtoUpdate = usersList[i].faultReports[j].faultID;
                      foundUserUID = true;
                      break;
                    }
              }
            }
          }
          if (foundUserUID === true && isResolved === false) {
            let ref = app.database().ref('/users/' + String(faultOwner) + `/faultReports/${targetFaultIDtoUpdate}`);
            ref.update({
              updates: updates,
              faultStatus: "ONGOING",
            });
            console.log("Admin updated Fault Report actions taken!");
            break;
          }
          if (foundUserUID === true && isResolved === true) {
            let ref = app.database().ref('/users/' + String(faultOwner) + `/faultReports/${targetFaultIDtoUpdate}`);
            ref.update({
              updates: updates,
              faultStatus: "RESOLVED",
            });
            console.log("Admin marked as resolved!");
            break;
          }
        }
      });
    } else {
      // No user is signed in.
    }
  });

  doDeleteReport = (faultOwner, faultCategory, faultDescription, faultOutlet) => 
  this.auth.onAuthStateChanged(function(authUser) {
    if (authUser!=null) {
      var targetFaultIDtoDelete = '';
      var userCountinUsersList = '';
      var foundUserUID = false;
      console.log("Admin UID: " + authUser.uid);
      // look for the exact same fault report in entire db
      app.database().ref('/users')
      .once('value')
      .then(snapshot => {
        const usersObject = snapshot.val();
        const usersList = Object.keys(usersObject).map(key => ({
          ...usersObject[key],
          uid: key,
        }));
        for (var i=0; i<usersList.length; i++) {
          if (usersList[i].roles.hasOwnProperty("USER")) {
            if (usersList[i].hasOwnProperty("faultReports")) {
              for (var j=0; j<usersList[i].faultReports.length; j++) {
                if (usersList[i].uid === faultOwner
                    && usersList[i].faultReports[j].faultCategory === faultCategory
                    && usersList[i].faultReports[j].faultDescription === faultDescription
                    && usersList[i].faultReports[j].faultOutlet === faultOutlet) {
                      targetFaultIDtoDelete = usersList[i].faultReports[j].faultID;
                      foundUserUID = true;
                      userCountinUsersList = i;
                      break;
                    }
              }
            }
          }
          if (foundUserUID === true) {
            let ref = app.database().ref('/users/' + String(faultOwner) + `/faultReports/${targetFaultIDtoDelete}`);
            ref.remove();
            console.log("Admin deleted Fault Report!");
            // Reorder the next few reports
            for (var k=(parseInt(targetFaultIDtoDelete)+1); k<usersList[userCountinUsersList].faultReports.length; k++) {
              var copyReport = usersList[userCountinUsersList].faultReports[k];
              copyReport.faultID = k-1;
              let ref = app.database().ref('/users/' + String(faultOwner) + `/faultReports/${String(k)}`);
              ref.remove();
              app.database().ref('/users/' + String(faultOwner) + `/faultReports/${String(k-1)}`).set(copyReport);
              console.log("reordering reports");
            }
            break;
          }
        }
      });
    } else {
      // No user is signed in.
    }
  });

  doCreateNewFaultReport = (dateSubmitted, faultID, faultCategory, faultDescription, faultOutlet) => 
  this.auth.onAuthStateChanged(function(authUser) {
    if (authUser!=null) {
      console.log(authUser.uid);
      app.database().ref('/users/' + authUser.uid + `/faultReports/${faultID}`).set({
        dateSubmitted: dateSubmitted,
        faultID: faultID,
        faultCategory: faultCategory,
        faultDescription: faultDescription,
        faultOutlet: faultOutlet,
        faultStatus: "OPEN",
        isAssigned: false,
        updates: "No updates yet.",
      });
      console.log("New faultReport created!");
    } else {
      // No user is signed in.
    }
  });

  doCreateNewFeedback = (dateSubmitted, feedbackID, feedbackCustomerName, feedbackCustomerEmail, feedbackDescription, feedbackOutlet) => 
  this.auth.onAuthStateChanged(function(authUser) {
    if (authUser!=null) {
      console.log(authUser.uid);
      app.database().ref('/users/' + authUser.uid + `/feedback/${feedbackID}`).set({
        dateSubmitted: dateSubmitted,
        feedbackID: feedbackID,
        feedbackCustomerName: feedbackCustomerName,
        feedbackCustomerEmail: feedbackCustomerEmail,
        feedbackDescription: feedbackDescription,
        feedbackOutlet: feedbackOutlet,
      });
      console.log("New feedback created!");
    } else {
      // No user is signed in.
    }
  });

  doDeleteFeedback = (feedbackCustomerName, feedbackCustomerEmail, feedbackDescription, feedbackOutlet) => 
  this.auth.onAuthStateChanged(function(authUser) {
    if (authUser!=null) {
      var userUID = '';
      var userCountinUsersList = '';
      var targetFeedbackIDtoDelete = '';
      var foundUserUID = false;
      console.log("Admin UID: ", authUser.uid);
      // look for the exact same feedback in entire db
      app.database().ref('/users')
        .once('value')
        .then(snapshot => {
          const usersObject = snapshot.val();
          const usersList = Object.keys(usersObject).map(key => ({
            ...usersObject[key],
            uid: key,
          }));
          for (var i=0; i<usersList.length; i++) {
            if (usersList[i].roles.hasOwnProperty("USER")) {
              if (usersList[i].hasOwnProperty("feedback")) {
                for (var j=0; j<usersList[i].feedback.length; j++) {
                  if (usersList[i].feedback[j].feedbackCustomerEmail === feedbackCustomerEmail
                      && usersList[i].feedback[j].feedbackCustomerName === feedbackCustomerName
                      && usersList[i].feedback[j].feedbackDescription === feedbackDescription
                      && usersList[i].feedback[j].feedbackOutlet === feedbackOutlet) {
                        userUID = usersList[i].uid;
                        targetFeedbackIDtoDelete = usersList[i].feedback[j].feedbackID;
                        foundUserUID = true;
                        userCountinUsersList = i;
                        break;
                      }
                }
              }
            }
            if (foundUserUID === true) {
              let ref = app.database().ref('/users/' + userUID + `/feedback/${targetFeedbackIDtoDelete}`);
              ref.remove();
              console.log("Feedback deleted!");
              // Reorder the next few feedbacks
              for (var m=(parseInt(targetFeedbackIDtoDelete)+1); m<usersList[userCountinUsersList].feedback.length; m++) {
                var copyFeedback = usersList[userCountinUsersList].feedback[m];
                copyFeedback.feedbackID = m-1;
                let ref = app.database().ref('/users/' + userUID + `/feedback/${String(m)}`);
                ref.remove();
                app.database().ref('/users/' + userUID + `/feedback/${String(m-1)}`).set(copyFeedback);
                console.log("reordering feedbacks");
              }
              break;
            }
          }
        });
    } else {
      // No user is signed in.
    }
  });
  
}

export default Firebase;