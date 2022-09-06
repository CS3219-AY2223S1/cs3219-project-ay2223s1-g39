import { createUser, loginUser, updatePassword, deleteUser } from '../model/repository.js';

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
    try {
        const newUser = await createUser({username: username, password: password});
        // newUser.save();
        return newUser;
    } catch (err) {
        return { err: err };
    }
}

export async function ormLogin(username, password) {
    try {
        const user = await loginUser({username: username, password: password})
        return user;
    } catch (err) {
        return {err: err}
    }
}

export async function ormUpdatePassword(username, oldPassword, newPassword) {
    try {
        const user = await updatePassword({username: username, oldPassword: oldPassword, newPassword: newPassword})
        return user
    } catch (err) {
        return {err: err}
    }
}

export async function ormDeleteUser(username, password) {
    try {
        const user = await deleteUser({username: username, password: password})
        return user
    } catch (err) {
        return {err: err}
    }
}