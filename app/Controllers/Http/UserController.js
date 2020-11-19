'use strict';

const Firestore = use('App/Models/Firestore');
const firestore = new Firestore;
const db = firestore.db();

const { validate } = use('Validator');

// Reference to
const userReference = db.collection('users');

class UserController {

  async create({ request, response}) {

    const rules = {
      name: 'required',
      email: 'required'
    };

    const data = request.only(['name', 'email']);

    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      return response.status(206).json({
        status: false,
        message: validation.messages()[0].message,
        data: null
      });
    }

    let create =  await userReference.add({
      name: data.name,
      email: data.email
    });

    if(create) {
      return response.status(201).json({
        status: true,
        message: 'User created successfully',
        data: null
      });
    }
  }

  async all({ response }) {

    let users = [];

    await userReference.get().then((snapshot) => {
      snapshot.forEach(doc => {
        let id = doc.id;
        let user = doc.data();

        users.push({
          id,
          ...user
        });
      })
    });

    return response.status(201).json({
      status: true,
      message: 'All users',
      data: users
    });
  }

  async update({ request, response }) {

    const rules = {
      id: 'required',
    };

    const data = request.only(['id', 'name', 'email']);

    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      return response.status(206).json({
        status: false,
        message: validation.messages()[0].message,
        data: null
      });
    }

    let getUser = await userReference.doc(data.id).get();
    let user = getUser.data();

    let update = await userReference.doc(data.id).update({
      name: data.name ? data.name : user.name,
      email: data.email ? data.email : user.email
    });

    if(update) {
      return response.status(201).json({
        status: true,
        message: 'User updated successfully',
        data: update
      });
    }
  }

  async delete({ request, response }) {

    const rules = {
      id: 'required',
    };

    const data = request.only(['id']);

    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      return response.status(206).json({
        status: false,
        message: validation.messages()[0].message,
        data: null
      });
    }

    await userReference.doc(data.id).delete();

    return response.status(201).json({
      status: true,
      message: 'User deleted successfully',
      data: null
    });

  }
}

module.exports = UserController;
