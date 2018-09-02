let CQLConnection

function insertAccessToken(accessToken, userId, callback){

    const addUserTokenQuery = `INSERT INTO user_tokens (access_token, user_id) VALUES('${accessToken}','${userId}');`

    CQLConnection.execQuery(addUserTokenQuery, (result) => {
        
        callback(result.error)
    })
}

function getAccessToken(accessToken, callback){

    const getUserTokenQuery = `SELECT * FROM user_tokens WHERE access_token = '${accessToken}';`

    CQLConnection.execQuery(getUserTokenQuery, (token) => {
        if(token.error)console.log('SQL error {db-handle-token} ',token.error)

        const userToken = (token.result !== null && token.result.length === 1) ? token.result[0] : new Error("Something went wrong retreiving user token")

        callback(userToken)
    })
}


module.exports = (connection) => {
    CQLConnection  = connection

    return {
        insertAccessToken : insertAccessToken,
        getAccessToken : getAccessToken
    }
}