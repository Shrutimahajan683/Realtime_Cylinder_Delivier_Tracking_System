require('dotenv').config()
const express=require('express')
const app=express()
const ejs=require('ejs')
const path=require('path')
const expressLayout=require('express-ejs-layouts')
const PORT=process.env.PORT || 3000
const mongoose=require('mongoose')
const session=require('express-session')
const flash=require('express-flash')
const MongoDbStore=require('connect-mongo')
const passport=require('passport')

const url='mongodb://localhost/oxygen';
mongoose.connect(url,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:true});
const connection=mongoose.connection;
connection.once('open',()=>{
    console.log('Database Connected ..');
}).catch(err=>{
    console.log('Connection failed..')
});




app.use(session({
    secret:process.env.COOKIES_SECRET,
    resave:false,
    store: MongoDbStore.create({
        mongoUrl: url
    }),
    saveUninitialized:false,
cookie:{maxAge:1000*60*60*24}}))

const passportInit=require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(express.json())
app.use((req,res,next)=>{
    res.locals.session=req.session
    res.locals.user=req.user
    next()
 })

 app.use(express.urlencoded({extended:false}))
app.use(flash())
app.use(express.static('public'))
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

require('./routes/web')(app)
   
app.listen(PORT,()=>{
    console.log('hey')
})