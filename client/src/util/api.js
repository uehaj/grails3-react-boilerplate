const urlBase = 'http://localhost:8080/';

export async function getBooks() {
  const url = `${urlBase}book?max=100`;
  const resp = await fetch(url, {
    method: 'GET',
  });
  return Promise.resolve(resp);
}

export async function getBook(id) {
  const url = `${urlBase}book/${id}`;
  const resp = await fetch(url, {
    method: 'GET',
  });
  return Promise.resolve(resp);
}

export async function updateBook(book) {
  const url = `${urlBase}book/${book.id}`;
  const resp = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
  return Promise.resolve(resp);
}

export async function createBook(book) {
  const url = `${urlBase}book`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
  return Promise.resolve(resp);
}

export async function deleteBook(id) {
  const url = `${urlBase}book/${id}.json`;
  const resp = await fetch(url, {
    method: 'DELETE',
  });
  return Promise.resolve(resp);
}

