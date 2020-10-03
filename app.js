/**
 * File: app.js
 * Desc: Booklist App - Vanilla JS - OOP style - all in one file
 *    // TODO: break out into modules and add Parcel to bundle them
 */

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// Handle UI tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const $booklist = document.querySelector('#book-list');
    const $row = document.createElement('tr');
    $row.innerHTML = `  
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</td>
      </tr>`;
    // render to DOM
    $booklist.appendChild($row);
  }

  static deleteBook(el) {
    if (el.classList.contains('delete'))
      el.parentElement.parentElement.remove();
    UI.showAlert('Book Removed', 'success');
  }

  static showAlert(msg, className) {
    const $containerDiv = document.querySelector('.container');
    const $form = document.querySelector('#book-form');
    // create alert
    const $alertDiv = document.createElement('div');
    const $alertMsg = document.createTextNode(msg);
    $alertDiv.className = `alert alert-${className}`;
    // render to DOM
    $alertDiv.appendChild($alertMsg);
    $containerDiv.insertBefore($alertDiv, $form);
    // Remove Alert After 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#book-form').reset();
  }
}

// Persist the books with localStorage API
class Store {
  static getBooks() {
    let books = [];
    if (localStorage.getItem('books') !== null)
      books = JSON.parse(localStorage.getItem('books'));
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    // spread in new book
    let newBooks = [...books, book];
    localStorage.setItem('books', JSON.stringify(newBooks));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    // filter out the book for removal
    const newBooks = [...books].filter((book) => book.isbn !== isbn);
    localStorage.setItem('books', JSON.stringify(newBooks));
  }
}

// Event: Display Books (R of CRUD)
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book (C of CRUD)
const myForm = document.querySelector('#book-form');
myForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;
  // Form Validation first cut
  if (title === '' || author === '' || isbn === '') {
    UI.showAlert('Please Fill in all Fields', 'danger');
  } else {
    // create a new Book object
    const newBook = new Book(title, author, isbn);
    // add Book to the UI
    UI.addBookToList(newBook);
    // add Book to local storage
    Store.addBook(newBook);
    UI.showAlert('Book Added', 'success');
    UI.clearFields();
  }
});

// Event: Delete a Book (D of CRUD)
document.querySelector('#book-list').addEventListener('click', (e) => {
  UI.deleteBook(e.target);
  // hack to read the text from the DOM (adding a data-isbn tag might be better)
  const isbnString = e.target.parentElement.previousElementSibling.textContent;
  Store.removeBook(isbnString);
});
