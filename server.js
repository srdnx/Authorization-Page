// Use express server module
const express = require('express');
const app = new express();

// Use bodyparser to parse POST requests
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Use expression parser for checking input data
const Parser = require('./parser.js');

// Use MongoDB module
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB_URI;
const dbname = process.env.MONGO_DB;

// Get PORT from global variable
const port = process.env.PORT;

// Front End directory
app.use(express.static(__dirname + '/client'));

// Create profiles collection in database if it doesn't exist
MongoClient.connect(url, function(err, db) {
	if (err) throw err;
	console.log("Connected to database!");
	var dbase = db.db(dbname);
	dbase.createCollection("profiles", function(err1, res) {
		if (err1) throw err1;
		db.close();
	});
});

// Start Server
app.listen(port, () => {
	console.log("Server started!");
});

// Login Request
app.post("/login", function (request, response) {
	if(!request.body) return response.sendStatus(400);

	// Response format
	var resp = {
		success: 0,
		text: '',
		userdata: {}
	};

	if(!Parser.parseLoginPassword(request.body.login, 3, 20)) {
		resp.text = 'Логин должен состоять с букв латинского алфавита, цифр и быть длиной от 3 до 20 символов';
		return response.send(JSON.stringify(resp));
	}
	if(!Parser.parseLoginPassword(request.body.password, 3, 20)) {
		resp.text = 'Пароль должен состоять с букв латинского алфавита, цифр и быть длиной от 3 до 20 символов';
		return response.send(JSON.stringify(resp));
	}

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbase = db.db(dbname);
		dbase.collection("profiles").findOne({login: request.body.login}, function(err, result) {
			if (err) throw err;

			if (result != null && result.password == request.body.password) {
				resp.text = 'Успешный вход!';
				resp.success = 1;
				resp.userdata = {
					login: result.login,
					email: result.email,
					name: result.name,
					date: result.date
				};
				response.send(JSON.stringify(resp));
			}
			else {
				resp.text = 'Неправильный логин или пароль!';
				response.send(JSON.stringify(resp));
			}
			db.close();
		});
	});
});

// Registration request
app.post("/register", function (request, response) {
	if(!request.body) return response.sendStatus(400);

	// Response format
	var resp = {
		success: 0,
		text: ''
	};

	if(!Parser.parseLoginPassword(request.body.login, 3, 20)) {
		resp.text = 'Логин должен состоять с букв латинского алфавита, цифр и быть длиной от 3 до 20 символов';
		return response.send(JSON.stringify(resp));
	}
	if(!Parser.parseEmail(request.body.email)) {
		resp.text = 'E-mail введен в неверном формате';
		return response.send(JSON.stringify(resp));
	}
	if(!Parser.parseName(request.body.name)) {
		resp.text = 'Полное имя должно содержать только буквы латинского, кириллического алфавитов и пробелы';
		return response.send(JSON.stringify(resp));
	}
	if(!Parser.parseDate(request.body.date)) {
		resp.text = 'Неверный формат даты рождения';
		return response.send(JSON.stringify(resp));
	}
	if(!Parser.parseLoginPassword(request.body.password, 3, 20)) {
		resp.text = 'Пароль должен состоять с букв латинского алфавита, цифр и быть длиной от 3 до 20 символов';
		return response.send(JSON.stringify(resp));
	}
	if(!Parser.checkPasswords(request.body.password, request.body.confirmpassword)) {
		resp.text = 'Пароли не совпадают';
		return response.send(JSON.stringify(resp));
	}

	// Database object
	var userobj = {
		login: request.body.login,
		email: request.body.email,
		password: request.body.password,
		name: request.body.name,
		date: request.body.date
	};

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbase = db.db(dbname);

		dbase.collection("profiles").findOne({login: request.body.login}, function(err, result) {
			if (err) throw err;
			if (result != null) {
				resp.text = 'Аккаунт с таким логином уже существует, выберите другой логин';
				response.send(JSON.stringify(resp));
				db.close();
			}
			else {
				dbase.collection("profiles").findOne({email: request.body.email}, function(err, result) {
					if (err) throw err;
					if (result != null) {
						resp.text = 'Аккаунт с таким E-mail уже существует, выберите другой E-mail';
						response.send(JSON.stringify(resp));
						db.close();
					}
					else {
						dbase.collection("profiles").insertOne(userobj, function(err, result) {
							if (err) throw err;
							resp.text = 'Успешная регистрация! Для входа в свой аккаунт перейдите во вкладку "Войти"';
							resp.success = 1;
							response.send(JSON.stringify(resp));
							db.close();
						});
					}
				});
			}
		});
	});

});
