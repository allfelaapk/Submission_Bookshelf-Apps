document.addEventListener('DOMContentLoaded', function () {
  const formSubmit = document.getElementById('inputBook');
  formSubmit.addEventListener('submit', function (e) {
    e.preventDefault();
    addBookData();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function generateId() {
  return +new Date();
}

const books = [];
const RENDER_EVENT = 'render-book';

function generatebookDataObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function addBookData() {
  const textBook = document.getElementById('inputBookTitle').value;
  const textAuthor = document.getElementById('inputBookAuthor').value;
  const yearNumber = document.getElementById('inputBookYear').value;

  const generateID = generateId();
  const bookDataObject = generatebookDataObject(
    generateID,
    textBook,
    textAuthor,
    yearNumber,
    false
  );
  books.push(bookDataObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener(RENDER_EVENT, function () {
  // console.log(books);
  const uncompletedBooksList = document.getElementById(
    'incompleteBookshelfList'
  );
  uncompletedBooksList.innerHTML = '';

  const completeBooksList = document.getElementById('completeBookshelfList');
  completeBooksList.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = createBook(bookItem);
    if (!bookItem.isCompleted) {
      uncompletedBooksList.append(bookElement);
    } else {
      completeBooksList.append(bookElement);
    }
  }
});

function createBook(bookDataObject) {
  const textBook = document.createElement('h2');
  textBook.innerText = bookDataObject.title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = bookDataObject.author;

  const yearNumber = document.createElement('p');
  yearNumber.innerText = bookDataObject.year;

  const list = document.createElement('div');
  list.classList.add('book-list');
  list.append(textBook, textAuthor, yearNumber);

  const container = document.createElement('div');
  container.classList.add('div-wrap');
  container.append(list);
  container.setAttribute('id', `books-${bookDataObject.id}`);

  if (bookDataObject.isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    const textElement3 = document.createElement('p');
    textElement3.textContent = 'belum dibaca ';
    undoButton.append(textElement3);

    undoButton.addEventListener('click', function () {
      undoBookFromCompleted(bookDataObject.id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    const textElement2 = document.createElement('p');
    textElement2.textContent = 'hapus buku';
    trashButton.append(textElement2);

    trashButton.addEventListener('click', function () {
      removeBookFromCompleted(bookDataObject.id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    const textElement = document.createElement('p');
    textElement.textContent = 'selesai dibaca';
    checkButton.append(textElement);
    checkButton.addEventListener('click', function () {
      checkBookToCompleted(bookDataObject.id);
    });

    container.append(checkButton);
  }

  return container;
}

// function untuk mengubah state iscompleted from false to true
function checkBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// function for findbook with related ID
function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

// function for remove book
function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget == -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

// function for undo book from completed
function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// create function for web storage
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert('Your browser not supported local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parse = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parse);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const getData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(getData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

// declare variable for checkbox
const checkbox = document.querySelector();
