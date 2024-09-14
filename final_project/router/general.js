const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password
    if (username && password) {
        if (users.find(user => user.username === username)) {
            res.status(409).send("Username already exists");
        } else {
            users.push({ "username": username, "password": password });
            res.send("The user" + (' ') + (req.body.username) + " Has been added!");
        }
    } else {
        res.status(400).send("Username and password required");
    }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    //Write your code here
    try {
        const bookList = await new Promise((resolve, reject) => {
            if (books) {
                resolve(books);
            } else {
                reject(new Error('Books data is not available'));
            }
        });
        res.send(JSON.stringify(bookList, null, 4));
    } catch (err) {
        res.status(404).send(err.message);
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    try {
        const bookDetails = await new Promise((resolve, reject) => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject(new Error('Book with ISBN does not exist'));
            }
        });
        res.send(bookDetails);
    } catch (err) {
        res.status(404).send(err.message);
    }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    //Write your code here
    const author = req.params.author;
    const booksArray = Object.values(books);
    try {
        const bookDetails = await new Promise((resolve, reject) => {
            const matchingBooks = booksArray.filter(book => book.author === author);
            if (matchingBooks.length) {
                resolve(matchingBooks);
            } else {
                reject(new Error('Book with specified author does not exist'));
            }
        })
        res.send(bookDetails);
    } catch (err) {
        res.status(404).send(err.message);
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    //Write your code here
    const title = req.params.title;
    const booksArray = Object.values(books);
    try {
        const allBooks = await new Promise((resolve, reject) => {
            const matchingBooks = booksArray.filter(book => book.title === title);
            if (matchingBooks.length) {
                resolve(matchingBooks);
            } else {
                reject(new Error('Book with specified title does not exist'));
            }
        })
        res.send(allBooks);
    } catch (err) {
        res.status(404).send(err.message);
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
