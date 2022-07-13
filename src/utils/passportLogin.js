const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {usuarios} = require('../models/mongoUsuariosModel');
const { encryptPass } = require('../utils/encryptPassword');
const { validatePass } = require('../utils/validatePassword')

passport.use('login', new LocalStrategy({usernameField: 'email'},
    (email, password, done) => {
        usuarios.findOne({email: email}, (err, user) =>{
            if(err) {
                return done(err);
            }
            if(!user) {
                console.log('No se escontro el usuario');
                return done(null, false);
            }
            if(!validatePass(user, password)){
                console.log('Contraseña incorrecta');
                return done(null, false);
            }
            return done(null, user);
        })
    }
))

passport.use('signup', new LocalStrategy(
    {passReqToCallback: true, usernameField: 'email'}, (req, email, password, done) => {
        usuarios.findOne({email: email}, (err, user) =>{
            if(err) {
                return done(err);
            }
            if(user) {
                console.log('Ya existe un usuario con ese email');
                return done(null, false);
            }
            console.log(req.body)
            const newUser = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: email,
                password: encryptPass(password)
            }
            console.log(newUser)
            
            usuarios.create(newUser, (err, id) => {
                if(err) {
                    console.log('Error en el registro')
                    return done(err)
                }
                console.log(id)
                console.log('Registrado correctamente')
                return done(null, id)
            })
        })
    }
))

passport.serializeUser((user, done) => {
    done(null, user._id)
})
passport.deserializeUser((id, done) => {
    usuarios.findById(id, done)
})

module.exports=passport