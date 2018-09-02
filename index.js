const port = 8000

const fs = require('fs')

const config = JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8'))
const cqlConnection = require('./dbHelpers/db-connection')(config.username, config.password, config.contactPoints, config.options)

const accessToken = require('./dbHelpers/db-handle-tokens')(cqlConnection)
const userDb = require('./dbHelpers/db-handle-user')(cqlConnection)

const oAuthModels = require('./authorization/init-access-token')(accessToken, userDb)
const oAuth2Server = require('node-oauth2-server')

const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.oauth = oAuth2Server({
    model : oAuthModels,
    grants : ['password'],
    debug : true
})

const authRouteMethods = require('./authorization/auth-route-methods')(userDb)
const authRouter = require('./authorization/router')(express.Router(), app, authRouteMethods)

app.use(bodyParser.urlencoded({extended:true}))

app.use(app.oauth.errorHandler())

app.use('/auth', authRouter)

app.listen(port, () => {
   console.log(`listening on port ${port}...`)
})