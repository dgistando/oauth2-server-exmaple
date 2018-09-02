let tokenHanlde
let userHandle

/**
 *  These are the methods called by the auth2-server for the password grant type.
 *  see https://oauth2-server.readthedocs.io/en/latest/model/overview.html#
 *  for more information and other grant types.
 */

function getClient(clientId, clientSecret, callback){

    const client = {
        clientId,
        clientSecret,
        grants : null,
        redirectUri : null
    }

    callback(false, client)
}

function grantTypeAllowed(clientId, grantType, callback){

    console.log('grant Type: ', grantType, ' client ID: ', clientId)

    callback(false, true)
}

function getUser(username, password, callback){
    userHandle.getUser(username,password,callback)
}

function saveAccessToken(accessToken, clientId, expires, user, callback){
    tokenHanlde.insertAccessToken(accessToken, user.username, callback)
} 

function getAccessToken( bearerToken, callback){
    tokenHanlde.getAccessToken(bearerToken, (userId) => {

        const accessToken = {
            user:{
                id : userId
            },
            expires: null
        }

        if(userId === null)
            callback(true, null)
        else
            callback(false, accessToken)
    })
}

module.exports = (tokenHanlder, userHandler) => {

    tokenHanlde = tokenHanlder,
    userHandle = userHandler

    return {
        getClient : getClient,
        grantTypeAllowed: grantTypeAllowed,
        getUser: getUser,
        saveAccessToken : saveAccessToken,
        getAccessToken : getAccessToken
    }
}