'use strict';

const Model = use('Model');

const admin = require('firebase-admin');

const serviceAccount = require("../../adonisjs-firestore-firebase-adminsdk-ajfbl-6a02cfaeb1.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://adonisjs-firestore.firebaseio.com"
});

class Firestore extends Model {

  db() {
    return admin.firestore();
  }

}

module.exports = Firestore;
