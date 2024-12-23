import {decryptToken, encryptToken} from "$lib/security.js";
import fs from 'fs';

const DB_PATH = "./src/db.json";
function get_data() {
    return new Promise(function(res, rej) {
        fs.readFile(DB_PATH, function(err, text) {
            if(err) rej(err)
            else res(JSON.parse(text));
        });
    });
}
function set_data(val) {
    return new Promise(function(res, rej) {
        fs.writeFile(DB_PATH, JSON.stringify(val), function(err) {
            if(err) rej(err)
            else res();
        });
    });
}
class UserStore {
    constructor(username, enc_token) {
        this.username = username;
        this.enc_token = enc_token;
    }
    static all() {
        return new Promise(function(res, rej) {
            get_data()
                .then(function(data) {
                    res(data.users.map(({username, gh_token}) => new UserStore(username, gh_token)));
                })
                .catch(rej);
        });
    }
    decrypt(password) {
        const _this = this;
        return new Promise(function(res, rej) {
            decryptToken(_this.enc_token, password) // remove this
                .then(function(token) {
                    res(new User(_this.username, token))
                })
                .catch(rej);
        });
    }
    static get_for(username) {
        return new Promise(function(res, rej) {
            UserStore.all()
                .then(function(enc_users) {
                    for(const t of enc_users) {
                        if(t.username == username) {
                            res(t);
                            break;
                        }
                    }
                    rej(null);
                })
                .catch(rej);
        });
    }
}

class User {
    constructor(username, gh_token) {
        this.username = username;
        this.gh_token = gh_token;
    }
    static from_signin(username, password) {
        console.log("Try to signin as", username, password);
        return new Promise(function(res, rej) {
            UserStore.get_for(username)
                .then(function(enc_user) {
                    console.log("Got enc user", enc_user);
                    enc_user.decrypt(password)
                        .then(res)
                        .catch((e) => console.log("Could not decrypt enc user", e));
                })
                .catch((e) => console.log("Could not get enc user", e));
        });
    }
};


export {User};