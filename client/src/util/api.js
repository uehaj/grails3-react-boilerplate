import $ from 'jquery';

const urlBase = 'http://localhost:8080/'

/**
 * APIs
 */
export async function getBooks() {
  const url = urlBase + 'book?max=100';
  const resp = await fetch(url, {
    method: 'GET',
    contentType: 'text/plain'
  });
  return Promise.resolve(await resp.json());
}

export async function getBook(id) {
  const url = urlBase + `book/${id}.json`;
  const resp = await fetch(url, {
    method: 'GET',
    contentType: 'application/json'
  });
  return Promise.resolve(await resp.json());
}

export function updateBook(id, book, callback, callbackError) {
  $.ajax({
    type: 'PUT',
    url: urlBase + `book/${id}.json`,
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify(book),
    cache: false,
    success: (data) => {
      if (callback !== undefined) {
        callback(data)
      }
    },
    error: (xhr, status, err) => {
      console.error(xhr, status, err.toString())
      if (callbackError !== undefined) {
        callbackError(err)
      }
    }
  });
}

export function createBook(book, callback, callbackError) {
  console.log(JSON.stringify(book));
  $.ajax({
    type: 'POST',
    url: urlBase + `book.json`,
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify(book),
    cache: false,
    success: (data) => {
      if (callback !== undefined) {
        callback(data)
      }
    },
    error: (xhr, status, err) => {
      console.error(xhr, status, err.toString())
      if (callbackError !== undefined) {
        callbackError(err)
      }
    }
  });
}

export function deleteBook(id, callback, callbackError) {
  $.ajax({
    type: 'DELETE',
    url: urlBase + `book/${id}.json`,
    contentType: 'application/json',
    dataType: 'json',
    cache: false,
    success: (data) => {
      if (callback !== undefined) {
        callback(data)
      }
    },
    error: (xhr, status, err) => {
      console.error(xhr, status, err.toString())
      if (callbackError !== undefined) {
        callbackError(err)
      }
    }
  });
}

