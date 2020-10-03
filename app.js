/**
 * File: app.js
 * Desc: All Booklist App Vanilla JS Functionality here
 *      - would likely be better with 1 Class per file, (esp UI)
 *      - and webpack/parcel to bundle them into a bundle.js, but this is OK for proto
 */

// Book Class: Represents a Book
class Book {
  // constructor method inits a class
  constructor(title, author, isbn) {
    // bind class props to the Class
    this.title = title;
    this.author = author;
    this.isbn = isbn;

    // bind methods  ?? -- not needed for static  -- on the object, not on object instance ? -- not so far
    // this.addBookToList = this.addBookToList.bind(this);
    // to instantiate a Book class instance, likely new Book(title,author,isbn)
  }
}

// UI Class: handle ui task (display, alerts)
// Methods: displayBooks(), addBookToList(), removeBookFromList() , showAlerts()
// in my app, i would just do the UI in another file (a js module)
// - then would need Parcel, Webpack
// to bundle them into your index.html
class UI {
  // class method here is a js fxn -- params, return, scope, context,
  static displayBooks() {
    // ?! understand static method ===a util method on the object itself,
    // not on the object instance
    // store some static books for now
    // const StoredBooks = [
    //   { title: 'Tropic of Cancer', author: 'Henry Miller', isbn: '3434343' },
    //   {
    //     title: 'Strangers',
    //     author: 'Highsmith',
    //     isbn: '5555'
    //   },
    //   {
    //     title: 'Hobbitt',
    //     author: 'Tolkin',
    //     isbn: '9999'
    //   }
    // ];
    // const books = StoredBooks;

    // V1.0: for real app -- set initial Store to the empty localStorage
    const books = Store.getBooks(); // loop thru the books and call addBookToList() on them -- split up the work!
    console.log('initial book display ', books);

    books.forEach(book => UI.addBookToList(book)); // main use case for Array.forEach()
  }

  // UI Class method to add static data into the DOM to render in the App
  static addBookToList(book) {
    // 1- create DOM vars -- using $var naming convention from jquery era
    const $booklist = document.querySelector('#book-list');
    const $row = document.createElement('tr');
    // set a template literal string for the display of books -- this is a render!
    $row.innerHTML = `  
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</td>
      </tr>`;
    // Use DOM to append a new DOM element -- trigger DOM manip memories
    $booklist.appendChild($row);
  }

  // DELETE Book
  static deleteBook(el) {
    // if el has delete class, remove the grandparent <tr> book item from the dom
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
      // likely add Storage.removeBook() here
    }
    UI.showAlert('Book Removed', 'success');
  }

  // Show ALERTS
  static showAlert(msg, className) {
    // Create alert div + child text node from scratch and insert into the DOM
    const $alertDiv = document.createElement('div');
    const $alertMsg = document.createTextNode(msg);
    $alertDiv.className = `alert alert-${className}`;
    $alertDiv.appendChild($alertMsg);

    // insert into the DOM - grab a parent - and also the node following it
    const $containerDiv = document.querySelector('.container');
    const $form = document.querySelector('#book-form');
    $containerDiv.insertBefore($alertDiv, $form);

    // Remove Alert After 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    //   document.querySelector('#title').value = '';
    //   document.querySelector('#author').value = '';
    //   document.querySelector('#isbn').value = '';
    //   console.log(document.querySelector('#title').value);
    // console.log('trying form reset instead of setting indiv field values to ""');
    document.querySelector('#book-form').reset();
  }
}

// Store Class: handles storage of the books with localStorage API
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  // take a book object and add to local storage -- existing books array
  static addBook(book) {
    // likely need to read in the existing books, check if there, then add
    // then reset
    // 1- get localStorage existing books
    // let existingBooks = localStorage.getItem(JSON.parse('books'));
    const books = Store.getBooks();
    // know books is an Array of Objects, so should spread into new array to
    // keep things immutable - doubtful if he does this steps
    // 2- go immutable
    // 3- Now push passed in book onto the array -- or use spread , add it - no push
    // he does not check if already there - likely later enhancement not needed yet
    // 3- set the new Book into localStorage
    let newBooks = [...books, book];
    localStorage.setItem('books', JSON.stringify(newBooks));
  }

  static removeBook(isbn) {
    // this will need to loop thru the array of objects - likely with filter
    const books = Store.getBooks();
    // 2- loop thru the array and filter out the one with the passed in isbn
    console.log('new books as ', newBooks);
    // 3- set the newBooks into localStorage
    let newBooks = [...books].filter(book => book.isbn !== isbn);
    localStorage.setItem('books', JSON.stringify(newBooks));
  }
}

// E-1: Event: Display Books in the Table
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// E-2: Event: Add a Book -  (both in the UI and in localStorage)
const myForm = document.querySelector('#book-form');
myForm.addEventListener('submit', e => {
  // TODO: refactor this to be a named function -- but which class this method
  // belongs to -- perhaps an Actions class ? -- hold off refactor just now

  // 0- prevent default for submit action - w/o form.action, submits to same page
  e.preventDefault();

  // 1- capture form values to vars
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  // 2- Validate
  if (title === '' || author === '' || isbn === '') {
    UI.showAlert('Please Fill in all Fields', 'danger');
  } else {
    // 3- Instantiate a Book class instance,
    const newBook = new Book(title, author, isbn);
    console.log(newBook);

    // 4!- add Book to the UI
    UI.addBookToList(newBook);

    // 5 - add Book to Store (local storage)
    Store.addBook(newBook);

    // 5- Show success msg
    UI.showAlert('Book Added', 'success');

    // +6- clear the form fields
    // UI.clearFields();
    //document.querySelector('#book-form').reset();
    UI.clearFields();
  }
});

// E-3: Event: Remove a Book - (both in the UI and in localStorage)
// PREDICT: put click event on each X  -- likely will need to use e.target
// also will likely use the Array.splice(index, 1) to remove that particular book

// 1- select the booklist and add event there
document.querySelector('#book-list').addEventListener('click', e => {
  // console.log(e.target); // this returns the elemene html (whether <a or <td)
  // 2- Delete Book from UI (pass the e.target to a method on the UI class)
  UI.deleteBook(e.target);

  console.log(
    'try parent.previousSibling',
    e.target.parentElement.previousElementSibling.textContent
  );
  // 3- Remove Book from Store (localStorage) -- use DOM traversal to get the isbn
  const isbnString = e.target.parentElement.previousElementSibling.textContent;
  Store.removeBook(isbnString);
});
