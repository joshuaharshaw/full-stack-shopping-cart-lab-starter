const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

const app = express();
// Serve files from public folder. That's where all of our HTML, CSS and Angular JS are.
app.use(express.static('public'));
// This allows us to accept JSON bodies in POSTs and PUTs.
app.use(bodyParser.json());

var pool = new pg.Pool({
	user:"postgres",
	password:"sqlbeast",
	host:"localhost",
	port:5432,
	database:"postgres",
	ssl:false
});


// GET /api/items - responds with an array of all items in the database.
app.get("/api/items", function (req, res) {
	pool.query("SELECT * FROM shopping_cart").then(function (response) {
		res.send(response.rows);
	}).catch(function (err) {
		res.send(err);
	});
});

// POST /api/items - adds and item to the database. The items name and price
// are available as JSON from the request body.
app.post("/api/items", function (req, res) {
	
	var values = [req.body.product, req.body.price];
	pool.query("INSERT INTO shopping_cart (product, price) VALUES ($1::text, $2::real)", values)
		.then(function(response){
			console.log("Item Added");
		});
});

// DELETE /api/items/{ID} - delete an item from the database. The item is
// selected via the {ID} part of the URL.
app.delete("/api/items/:id", function (req, res) {

	var id = parseInt(req.params.id);
	pool.query("DELETE FROM shopping_cart WHERE id=$1::int", [id]).then(function() {
        res.send("DELETED ITEM " + id);
    }).catch(function (err) {
		res.send(err);
		console.log("Try Again");
	});
});

var port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log('JSON Server is running on Port: ' + port);
});
