const AccessToken = require('./access_token');
const config = require('../config');

const accessToken = new AccessToken(config);

const menu = {

}

const createMenu = async function () {
    const token = await accessToken.ensureAccessToken();
    
}

module.exports = createMenu;

