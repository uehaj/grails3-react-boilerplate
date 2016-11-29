const urlBase = 'http://localhost:8080/'

export async function getBooks() {
  const url = urlBase + 'book?max=100';
  const resp = await fetch(url, {
    method: 'GET'
  });
  return Promise.resolve(await resp.json());
}

export async function getBook(id) {
  const url = urlBase + `book/${id}.json`;
  const resp = await fetch(url, {
    method: 'GET'
  });
  return Promise.resolve(await resp.json());
}

export async function updateBook(id, book) {
  console.log('book=',book);
  const url = urlBase + `book/${id}.json`;
  const resp = await fetch(url, {
    method: 'PUT',
    body: book
  });
}

export async function createBook(book) {
  const url = urlBase + `book.json`;
  const resp = await fetch(url, {
    method: 'POST',
    body: book
  });
}

export async function deleteBook(id, callback, callbackError) {
  const url = urlBase + `book/${id}.json`;
  const resp = await fetch(url, {
    method: 'DELETE'
  });
}

