import hat from 'hat';

//todo: Token expiration

export default class AuthToken {
    constructor() {
        this.token = hat(256);
        this.userId = null;
    }
}