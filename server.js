//Round 2 OF server.js

'use strict';

// THE CHAMBER OF SECRETS
require('dotenv').config();


// APP DEPENDENCIES - npm i these guys
const express = require('express');
// --our heavy lifter
const methodOverride = require('method-override');
// --our stormtrooper costumes
const pg = require('pg');
// --our DB
const superagent = require('superagent');
// --works with the APIs
const ejs = require('ejs');


// APP SETUP
const app = express();
// --we loaded it, now we are turning it on.
const PORT = process.env.PORT;
// --locating our port so we a place to do business


// DB SETUP
const client = new pg.Client(process.env.DATABASE_URL);
// --setting the client
client.connect();
// --we're connected
client.on('error', err => console.log(err));
// --catch and forward errors from pg to callback or promise that was in play


// APP MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
// --this parses out extra char from urls
app.use(express.static('public'));
// --points to our public folder which deals with static assets; nonEJS stuff

// Middleware for PUT and DELETE
app.use(methodOverride((request, response) => {
  if (request.body && typeof request.body === 'object' && '_method' in request.body) {
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
  // is there esomething there? and if there is. Is it an object? AND is '_method' a property in that object
  // when we get POST there will be request.body, so we will use this to do "PUT"
}));

// SERVER-SIDE TEMPLATING with VIEW ENGINE
app.set('view engine', 'ejs');
// --the app is view engine and root is view folder, ejs is the extension of the templating we will create


// API Routes
// *get publishes everything onto the URL-line
// *post, everything is invisible because it is in the body
app.get('/', getBooks);
// --our home route shows our saved books
app.post('/searches', createSearch);
// --the results of a serach for us to click on
app.get('/searches/new', newSearch);
// --new search for books
app.post('/books', createBook);
// --creating a book in our DB
app.get('/books/:id', getBook);
// --a specific book, looking for books/(an info-param)

app.get('*', (request, response) => response.status(404).send('Looks like we made a wrong turn at Albuquerque.'));
// --catch all for accidental wrong path!

app.listen(PORT, () => console.log(`I'm listening to you on ${PORT}~`));
// --our server is now listening!


// HELPER FNs
// Make books - take API results and turns them into book objects we can render
function Book(info) {
  const placeholderImg = 'https://www.fillmurray.com/128/200';

  const regexHttps = /^(http:\/\/)/g;

  // we use the ternary to make sure there is info in the field

  this.title = info.title ? info.title : 'Sorry, title unavailable.';
  this.author = info.authors ? info.authors : 'Sorry, author(s) unavailable.';
  this.isbn = info.industryIdentifiers ? `${info.industryIdentifiers[0].type} - ${info.industryIdentifiers[0].identifier}` : 'Sorry, ISBN unavailable.';
  this.image_url = info.imageLinks ? info.imageLinks.smallThumbnail.replace('https://',regexHttps) : placeholderImg;
  this.description = info.description ? info.description : 'Sorry, description unavailable.';
  this.id = info.industryIdentifiers ? `${info.industryIdentifiers[0].identifier}` : '';
}


// FUNCTION: The Book Getter, gets all the books from SQL
// --we are checking if there are any books there: if not, go back to the new search page; if there are, we will put them on our index! {prop:val} 
function getBooks(request, response) {
  let SQL = 'SELECT * FROM books;';

  return client.query(SQL)
    .then(results => {
      if (results.rows.rowCount === 0) {
        response.render('pages/searches/new');
      } else {
        response.render('pages/index', {books: results.rows})
      }
    })
    .catch(err => errorHandler(err, response));
}


// FUNCTION: Search for new books query maker
// --we are dynamically creating search based off of user choice, then getting the result, mapping over it to create books and rendering it on the show page
function createSearch(request, response) {
  let url = 'https://www.googleapis.com/books/v1/volumes?q='

  if (request.body.search[1] === 'title') { url += `+intitle:${request.body.search[0]}`; }
  if (request.body.search[1] === 'author') { url += `+inauthor:${request.body.search[0]}`; }

  superagent.get(url)
    .then(apiResponse => apiResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo)))
    .then(results => response.render('pages/searches/show', { books: results }))
    .catch(err => errorHandler(err, response));
}


// FUNCTION: New Search Fn for New Books
// --takes you to the page that has our empty search set up
function newSearch(request, response) {
  response.render('pages/searches/new');
}


// FUNCTION: Create Book FN
// --destructuring to populate, like in react
function createBook(request, response) {
  
  let normalShelf = request.body.bookshelf.toUpperCase();

  let { title, author, isbn, image_url, description } = request.body;
  let SQL = 'INSERT INTO books(title, author, isbn, image_url, description, bookshelf) VALUES($1,$2,$3,$4,$5,$6);';
  let values = [title, author, isbn, image_url, description, normalShelf];

  return client.query(SQL, values)
    .then(() => {
      SQL = 'SELECT * FROM books WHERE isbn=$1;';
      values = [request.body.isbn];
      return client.query(SQL, values)
        .then(result => response.redirect(`/books/${result.rows[0].id}`))
        .catch(errorHandler);
    })
    .catch(err => errorHandler(err, response));
}


// FUNCTION Get BOOK, just ONE
// --pull up a single book
function getBook(request, response) {
  getBookshelves()
    .then(shelves => {
      let SQL = 'SELECT * FROM books WHERE id=$1;';
      let values = [request.params.id];

      client.query(SQL, vaues)
        .then(result => response.render('pages/books/show', { book: result.rows[0], bookshelves: shelves.rows }))
        // .catch(err => errorHandler(err, response));
    })
    .catch(err => errorHandler(err, response));
}

// this is to select a specific shelf
function getBookshelves() {
  let SQL = 'SELECT DISTINCT bookshelf FROM books ORDER BY bookshelf;';

  return client.query(SQL);
}


// ERROR HANDLER
function errorHandler(error, response) {
  response.render('pages/error');
}