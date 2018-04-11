import hat from 'hat';

export default class AuthToken {
    constructor() {
        this.token = hat(256);
        this.issuedDate = Date.now();
        this.userId = null;
        this.username = null;
    }
}