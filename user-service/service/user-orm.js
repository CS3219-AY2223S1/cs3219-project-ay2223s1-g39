import { createUser, loginUser } from '../model/repository.js';

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
    try {
        const newUser = await createUser({username: username, password: password});
        newUser.save();
        return true;
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