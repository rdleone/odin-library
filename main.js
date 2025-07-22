let myLibrary = [];

class Book {

    constructor(title, author, pages) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isRead = false;
    }

    info() {
        const readStatus = this.isRead ? "has been read" : "not read yet";
        return `${this.title} by ${this.author}, ${this.pages} pages, ${readStatus}`;
    }
}

/**
 * Add a Book to the provided library.
 * @param {Book} Book - A valid Book
 * @param {array} library - An array of Books and their cards
 * @returns The new size of the library
 */
function addBookToLibrary(book, library, bookCard = null) {
    return library.push({
        book: book,
        card: bookCard
    });
}

/**
 * Remove a Book from the provided library.
 * @param {Book} Book - A valid Book
 * @param {array} library - An array of Books and their cards
 * @returns The updated library
 */
function removeBookFromLibrary(book, library) {
    let i = library.findIndex(entry => Object.is(entry.book, book));
    if(i !== -1) {
        removeBookCard(library[i].card);
        return library.splice(i, 1);
    } else {
        throw new Error("Book not found in the library");
    }
}

/**
 * Create a card that displays a Book's information.
 * @param {Book} book - A valid Book
 */
function createBookCard(book) {
    const bookCard = document.createElement('div');

    fetch('./components/book-card.html')
    .then(response => {
        if(response.ok) {
            return response.text();
        }
    })
    .then(html => {
        bookCard.innerHTML = html;

        // Set card content
        bookCard.querySelector(`#book-title`).textContent = book.title;
        bookCard.querySelector(`#book-author`).textContent = book.author;
        bookCard.querySelector(`#book-pagecount`).textContent = `Pages: ${book.pages}`;

        // Add event handlers
        bookCard.querySelector("#toggle-read").addEventListener("click", () => {
            let isRead = !book.isRead;
            
            if(isRead) {
                bookCard.querySelector("#toggle-read > img").setAttribute("src", "./assets/svg/eye.svg");
                bookCard.querySelector("#book-read-text").textContent = "Read";
            } else {
                bookCard.querySelector("#toggle-read > img").setAttribute("src", "./assets/svg/eye-disabled.svg");
                bookCard.querySelector("#book-read-text").textContent = null;
            }
            book.isRead = isRead;
            
        });
        bookCard.querySelector("#delete-book").addEventListener("click", () => {
            removeBookFromLibrary(book, myLibrary);
        });
    });

    return bookCard;
}

/**
 * Remove the Book card from the library display.
 * @param {Node} bookCard - A valid Book card
 * @returns The removed card
 */
function removeBookCard(bookCard) {
    return libraryDisplay.removeChild(bookCard);
}

/**
 * Updates the library display with all current books in the library.
 * @param {array} library - An array of Books and their cards
 */
function displayLibrary(library) {
    
    clearLibraryDisplay(library);

    for(let i = 0; i < library.length; i++) {
        try {
            // const bookCard = upsertBookCard(library[i].book, library);
            // libraryDisplay.appendChild(bookCard);
            libraryDisplay.appendChild(library[i].card);
        } catch(error) {
            console.log(`Failed to display book ${i}: ${error}`);
        }
    }
}

/**
 * Removes all books from the library display.
 */
function clearLibraryDisplay() {

    // Remove from library display
    while(libraryDisplay.firstChild) {
        let bookCard = libraryDisplay.firstChild
        libraryDisplay.removeChild(bookCard);
    }
}

/**
 * Displays the book creation modal.
 * @param {Node} target - The Node the modal is loaded into
 */
function loadBookModal(target) {
    fetch('./components/modal.html')
    .then(response => {
        if(response.ok) {
            return response.text();
        }
    })
    .then(html => {
        // Add modal content to page
        target.innerHTML = html;

        let modal = document.querySelector("#add-book-prompt");
        modal.showModal();

        const closeModalBtn = document.querySelector("#modal-cancel");
        const submitFormBtn = document.querySelector("#modal-submit");
        let form = document.querySelector("#add-book-form");

        closeModalBtn.addEventListener("click", () => {
            modal.close();
        });
        submitFormBtn.addEventListener("click", (event) => {
            modal.close();
            event.preventDefault(); // Block normal submission and retrieve data
            const formData = new FormData(form);

            const newBook = new Book(formData.get("title"), formData.get("author"), formData.get("pages"));
            const bookCard = createBookCard(newBook);
            addBookToLibrary(newBook, myLibrary, bookCard);
            displayLibrary(myLibrary);
        })
    });
}

/** MAIN **/

const libraryDisplay = document.querySelector(".library-display");
const newBookBtn = document.querySelector("#new-book");
const target = document.querySelector(".target");
newBookBtn.addEventListener('click', () => {
   loadBookModal(target);
});