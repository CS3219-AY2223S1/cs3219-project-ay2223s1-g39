import userModel from '../model/user-model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

export async function createUser(params) {
  const username = params.username
  const password = params.password
  const user = await userModel.findOne({username: username})
  if (username.trim() == '') {
    throw "Please enter a valid username!"
  }
  if (username.length < 5) {
    throw "Please enter a username with 5 or more characters!"
  }
  if (user != null) {
    throw "Username already taken!"
  }
  if (password.trim() == '') {
    throw "Please enter a valid password!"
  }
  if (password.length < 5) {
    throw "Please enter a password with 5 or more characters!"
  }
  
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  let newUser = await userModel.create({
    username: username,
    password: hash,
  });
  
  const token = jwt.sign(
      { user_id: newUser._id },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
  newUser = newUser.toObject()
  newUser.token = token
  return newUser
}

export async function loginUser(params) {
  const username = params.username;
  const password = params.password;
  if (username.length < 5) {
    throw "Please enter a valid username!"
  }
  if (password.length < 5) {
    throw "Please enter a valid password!"
  }
  let user = await userModel.findOne({username: username})
  if (user == null) {
    throw "No such user found!"
  }
  const isCorrectPw = await bcrypt.compare(password, user.password)
  let token;
  if (isCorrectPw) {
    console.log(user.role)
    if (user.role && user.role.includes('admin')) {
      token = jwt.sign(
      { user_id: user._id, 
      role: 'admin' },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    } else {
      token = jwt.sign(
        { user_id: user._id },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
    }
    console.log(token)
    user = user.toObject()
    user['token'] = token
    
    return user
  } else {
     throw "Invalid password!"
  }
}

export async function updatePassword(params) {
  const uid = params.uid
  console.log(uid)
  const username = params.username
  const opw = params.oldPassword
  const npw = params.newPassword
  if (username.length < 5) {
    throw 'Please enter a valid username!'
  }
  const user = await userModel.findOne({_id: uid})
  if (user == null) {
    throw "No such user found or JWT expired!"
  }
  if (user.username != username) {
    throw "Username linked with JWT is different from username sent!"
  }
  if (npw.length < 5) {
    throw "Please enter a password with 5 or more characters!"
  }
  if (npw.trim() == '') {
    throw "Please enter a valid new password!"
  }
  if (opw.length < 5) {
    throw 'Please enter a valid password!'
  }

  const isCorrectPw = await bcrypt.compare(opw, user.password)
  if (isCorrectPw) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(npw, salt);

    const updatedUser = await userModel.findOneAndUpdate({_id: uid}, {$set: {password: hash}})
    return updatedUser;
  } else {
     throw 'Wrong password!'
  } 
}


export async function deleteUser(params) {
  const uid = params.uid
  const username = params.username
  const password = params.password
   if (username.length < 5) {
    throw 'Please enter a valid username!'
  }
  const user = await userModel.findOne({_id: uid})
  if (user == null) {
    throw "No such user found or JWT expired!"
  }
  if (user.username != username) {
    throw "Username linked with JWT is different from username sent!"
  }
  if (password.length < 5) {
    throw 'Please enter a valid password'
  }

  const isCorrectPw = await bcrypt.compare(password, user.password)
  if (isCorrectPw) {
    const updatedUser = await userModel.findOneAndDelete({username: username})
    return updatedUser
  } else {
     throw 'Wrong password!'
  } 
}