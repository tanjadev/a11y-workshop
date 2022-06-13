const express = require('express');
const handlebars = require('express-handlebars');
const livereload = require("livereload");
const livereloadcon = require('connect-livereload')();
const morgan = require('morgan');
const path = require('path');

const data = require('./data.js');

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'src'))
liveReloadServer.server.once("connection", () => {
	setTimeout(() => {
		liveReloadServer.refresh("/");
	}, 100);
});



const app = express();

app.use(morgan('dev'));
app.use(livereloadcon);


app.use('/node_modules', express.static('node_modules/'));
app.use(express.static('src/'));

const handlebarOptions = {
	extname: 'hbs',
	partialsDir: 'src/partials',
	helpers: {
		times: (n, block) => {
			var accum = '';
			for (var i = 0; i < n; ++i)
				accum += block.fn(i);
			return accum;
		}
	}
};
const engine = handlebars.create(handlebarOptions)
app.engine('.hbs', engine.engine);
app.set('view engine', '.hbs');

// Resolve all view in /src path
app.set('views', path.resolve('src'));

app.get('/', function (req, res) {
	res.render('index.hbs', { ...data, layout: false });
});


app.listen(3000, () => {
	console.log('App is running at http://localhost:3000');
});
