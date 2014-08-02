#!/usr/bin/env node

var express  = require('express'),
	app      = express(),
	mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/angularapi');

var Todo = mongoose.model('Todo', {
	text: String
});

app.configure(function() {
	app.use(express.static(__dirname + '/public'));		
	app.use(express.logger('dev'));						
	app.use(express.bodyParser());						
	app.use(express.methodOverride());					
});

app.get('/api/todos', function(req, res){
	Todo.find(function(err, todos){
		if(err){
			res.send(err);
		}
		res.json(todos);
	});
});

app.post('/api/todos', function(req, res){
	Todo.create({
		text: req.body.text,
		done: false
	}, function(err, todo){
		if(err){
			res.send(err);
		}
		Todo.find(function(err, todos){
			if(err){
				res.send(err);
			}
			res.json(todos);
		});
	});
});

app.delete('/api/todos/:todo', function(req, res){
	Todo.remove({
		_id: req.params.todo
	}, function(err, todo){
		if(err) res.send(err);

		Todo.find(function(err, todos){
			if(err) res.send(err);
			res.json(todos);
		});
	});
});

app.get('*', function(req, res){
	res.sendfile('./public/index.html');
})

app.listen(80, function(err){
	if(err) throw err;
	console.log("El servidor corre en el puerto 80");
});

