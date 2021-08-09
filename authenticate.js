const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const jsonWebToken = require('jsonwebtoken');

const JWT_SECRET = require('./config');
const {users} = require('./firebase')

let opts = {}
opts.secretOrKey = JWT_SECRET;
opts.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();

module.exports.jwtPassport = passport.use(new jwtStrategy(opts, async(jwt_payload,done) => {
    const user = (await users.doc(jwt_payload).get()).data()
    if(!user){
        done("User Not Found",false)
    }else if(user){
        done(null,user)
    }
}))

module.exports.getToken = (username) => {
    return jsonWebToken.sign(username,JWT_SECRET)
}

module.exports.verifyUser = passport.authenticate('jwt',{session:false});