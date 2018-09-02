const cassandra = require('cassandra-driver')

{
    let client

    //connects to the db given credentials from a config.json file.
    function connect(uanme, pass, contactPoints, options){
        const authProvider = new cassandra.auth.PlainTextAuthProvider(uanme, pass);

        const cassClient = new cassandra.Client({
            contactPoints: contactPoints,
            keyspace : options.keyspace,
            authProvider : authProvider
        })

        return cassClient
    }

    function execQuery(query, callback){

        client.execute(query, (err, res) => {
            if(err)console.log('error: ',err)

            //The format of a full result has extra information.[ip,keyspace,consistency,traceID]
            //Thisis easier for debug. For Cassandra the data is under the rows key.
            res = (res.rows !== undefined) ? res.rows : { status : "success"};
            //print the result to console. more for me in debug
            //console.log('result EXEC!!!!!!: ', res)
            //console.log('err: ', err)
    
            //function to for the response object
            callback(cb(err, res))
        })
    }

    function cb(err, res){
        //return the db object to the caller
        return {
            error: err,
            result : (res === undefined || res === null) ? null : res 
        }
    }

    module.exports = (username, password, contactPoints, options) => {

        client = connect(username, password, contactPoints, options)

        return {
            execQuery : execQuery
        }
    }
}