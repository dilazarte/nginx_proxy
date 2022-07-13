const express = require('express')
const handlebars = require('express-handlebars');
const path =  require('path');
const app = express()
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { infoSys } = require('./src/utils/dataInfo')
const passport = require('./src/utils/passportLogin')
require('dotenv').config()
const parseArgs = require('minimist')

//utilizando minimist para setear puerto por defecto o recibirlo por parametro.-
const defaultOp = {
    default: {port: 8080},
    alias: {p:'port'}
};
const args = parseArgs(process.argv.slice(2), defaultOp);

const PORT = args.port;


//rutas
const adminRouter = require('./src/routes/admin');
const chatsRouter = require('./src/routes/chatRoutes')
const prodTest = require('./src/routes/productosRoutes')
const loginRouter = require('./src/routes/login');
const logoutRouter = require('./src/routes/logout');
const inicioRouter =  require('./src/routes/inicio');
const registerRouter = require('./src/routes/register');
const loginError =  require('./src/routes/loginerror')
const signUpError =  require('./src/routes/signuperror')
const randomsNums = require('./src/routes/randoms')


//para recibir info desde post
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//template engine
app.engine(
    'hbs',
    handlebars.engine({
        extname:'.hbs',
        defaultLayout: path.join(__dirname, './src/views/layaouts/index.hbs'),
        layoutsDir:path.join(__dirname, './src/views/layaouts'),
        partialsDir: path.join(__dirname,'./src/views/partials')
    })
);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, './src/views'));
app.use(express.static(path.join(__dirname, '/public')));

//configurando sesiones en mongo.-
const mongoOptions = {useNewUrlParser: true, useUnifiedTopology: true}
app.use(session({
    store: MongoStore.create({
        mongoUrl:`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/sesiones?retryWrites=true&w=majority`,
        ongoOptions: mongoOptions
    }),
    cookie: {maxAge: 120000},
    secret:"sesionSecreta123",
    resave:true,
    saveUninitialized:true,
    rolling:true
}))

//iniciando passport.-
app.use(passport.initialize());
app.use(passport.session());


app.use('/', inicioRouter)
app.use('/api/productos', prodTest)
app.use('/api/chat', chatsRouter)
app.use('/login', loginRouter)
app.use('/logout', logoutRouter)
app.use('/admin', adminRouter)
app.use('/register', registerRouter)
app.use('/loginError', loginError)
app.use('/signupError', signUpError)
//ruta randoms
app.use('/api/randoms', randomsNums)
//ruta info!
app.get('/info', (req, res) => {
    res.json(infoSys)
})


const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

io.on('connection', (socket) => {
    console.log(`Usuario conectado ${socket.id} - ${socket.handshake.address}`);
    
    socket.emit('msg', '')
    socket.on('newMsg', ()=>{
        io.sockets.emit('msg', '')
    })
});


const serverON = httpServer.listen(PORT, ()=>{
    console.log(`Server on port ${PORT} - PID: ${process.pid}`)
})
serverON.on('error', error=> console.log(`Error del servidor ${error}`))
