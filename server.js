const express = require('express');
const app = express();
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser');
const fetch = require('fetch')
const fs = require('fs')
const ip = require('ip')

console.log(ip.address('public'))


var user = ""

var validationReg = 0
var validationAdm = 0
var validationAdmRes = 0
var validationNuser = 0 

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view-engine', 'ejs')

////////////////////////////////////////////////INDEX
app.get('/', (req, res) => { //aqui está a página inicial
    validationAdmRes = 0
    var dataT = fs.readFileSync('./validation/newUser.json', 'utf8')
    var data = JSON.parse(dataT)
    if(data.newUser == "true"){
        res.render('indexNU.ejs')
    }
    else{
        res.render('indexOU.ejs')
    }
    console.log(data.newUser)
});
/////////////////////////////////////////////////LOGIN
app.get('/login', (req, res) => {
    res.render('login.ejs')
});
app.post('/login', (req, res) => {

    var dataT = fs.readFileSync('./files/test.json', 'utf8')
    var data = JSON.parse(dataT+']}')

    console.log(data.users)
    console.log(data.users.length)
    
    ///elementos do banco de dados
    //var v_email = data.users[0].email
    //var v_password = data.users[0].password
    //var v_name = data.name
    ///elementos do site
    var numUsers = data.users.length
    var n_email = req.body.email
    var n_password = req.body.senha
    var i = 0
    while(i < numUsers){
        ///elementos do banco de dados
        var v_email = data.users[i].email
        var v_password = data.users[i].password
        var v_name = data.users[i].name
        if((n_email == v_email)&&(n_password == v_password)){
            validationNuser = 1
            var nameUser = v_name
            i = numUsers
        }
        else{
            //res.redirect('/login')
            validationReg = 0
            validationAdm = 0
            validationNuser = 0
            i++
        }
    }
    i = 0
    if(validationNuser = 1){
        res.redirect('/nuser')
    }
    else{
        res.redirect('/login')
    }

    console.log(v_email)
    console.log(v_password)
    console.log(n_email)
    console.log(n_password)
    console.log(data)
    //res.redirect('/login')
});
/////////////////////////////////////////////////NUSER_PAGE
app.get('/nuser', (req, res) => {
    if(validationNuser == 1){
        res.render('nuser.ejs', { name: 'nuser' })
    }
    else{
        res.redirect('/login')
    }
});
app.post('/nuser', (req, res) => {
    validationNuser = 0
    res.redirect('/login')
});

/////////////////////////////////////////////////REGISTER
app.get('/register', (req, res) => {
    if(validationReg == 1){
        res.render('register.ejs')
    }
    else{
        res.redirect('/login_adm')
    }
});
app.post('/register', async (req, res) => {
    var dataT = fs.readFileSync('./files/test.json', 'utf8')
    var data = '{ \n    "users": ['
    //var length = data.length
    if(data == dataT){
        fs.writeFileSync('./files/test.json', '\n' +
        '{'+
        '\n"name": ' + '"'+ req.body.nome+ '"' +
        ', \n"email": ' + '"'+ req.body.email + '"'+ 
        ', \n"password":' + '"'+ req.body.senha + '"'+ 
        '\n}', { flag: 'a+' })
    }
    else{
        fs.writeFileSync('./files/test.json', '\n' +
        ',{'+
        '\n"name": ' + '"'+ req.body.nome+ '"' +
        ', \n"email": ' + '"'+ req.body.email + '"'+ 
        ', \n"password":' + '"'+ req.body.senha + '"'+ 
        '\n}', { flag: 'a+' })
    }
    res.redirect('/admin')
    console.log(user);
    data = fs.readFileSync('./files/test.json', 'utf8')
    console.log(data)
    user = {}
    fs.writeFileSync('./validation/newUser.json', '{'+ '\n'+
        '"newUser": "false"' + 
    '\n'+'}')
    //validationReg = 0
});
/////////////////////////////////////////////////LOGIN_ADM
app.get('/login_adm', (req, res) => {
    res.render('login_adm.ejs')
});
app.post('/login_adm', async (req, res) => {
    var dataT = fs.readFileSync('./files/user_adm.json', 'utf8')
    var data = JSON.parse(dataT)
    var v_email = data.email
    var v_password = data.password

    var n_email = req.body.email
    var n_password = req.body.senha

    if((n_email == v_email)&&(n_password == v_password)){
        res.redirect('/admin')
        validationReg = 1
        validationAdm = 1
        validationAdmRes = 1
    }
    else{
        res.redirect('/login_adm')
        validationReg = 0
        validationAdm = 0
    }

    console.log(data.email)
    console.log(data.password)
    console.log(req.body.email)
    console.log(req.body.senha)
    console.log(data)



    //validation = 1
    //res.redirect('/login_adm')
});
//////////////////////////////////////////////ADMIN_PAGE
app.get('/admin', (req, res) => {
    if(validationAdm == 1){
        validationReg = 1
        validationAdmRes == 1
        res.render('admin.ejs', { name: 'gugu' })  
        console.log(validationAdmRes) 
    }
    else{
        res.redirect('/login_adm')
        //validationAdmRes == 0
    }
});
app.post('/admin', (req, res) => {
    
    //res.redirect('/logout')
    validationAdm = 0
    validationReg = 0
    validationNuser = 0
    console.log(validationAdmRes)
    res.redirect('/')
});
////////////////////////////////////////////////LOGOUT
/*app.get('/logout', (req, res) => {
    validationAdm = 0
    //validationAdmRes = 0
    validationNuser = 0
    validationReg = 0
});*/
////////////////////////////////////////////////RESET_SYS
app.get('/reset', (req, res) => {
    console.log(validationAdmRes)
    if(validationAdmRes == 1){
        res.render('reset.ejs')    
    }
    else{
        res.redirect('/login_adm')
    }
});
app.post('/reset', (req, res) => {
    validationReg = 0
    validationAdm = 0
    validationAdmRes = 0
    validationNuser = 0

    fs.writeFileSync('./validation/newUser.json', '{'+ '\n'+
        '"newUser": "true"' + 
    '\n'+'}')
    fs.writeFileSync('./files/test.json', '{ \n    "users": [')

    res.redirect('/')
    
});

/////////////////////////////////////////////////START_SERVER
app.listen(3000);



