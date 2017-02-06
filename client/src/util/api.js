async function getEntities(urlBase, entityName, max = 0) {
  const url = (max <= 0)
        ? `${urlBase}${entityName}`
        : `${urlBase}${entityName}?max=${max}`;
  const resp = await fetch(url, {
    method: 'GET',
  });
  return resp.ok ? Promise.resolve(resp) : Promise.reject(resp);
}

async function getEntity(urlBase, entityName, id) {
  const url = `${urlBase}${entityName}/${id}`;
  const resp = await fetch(url, {
    method: 'GET',
  });
  return resp.ok ? Promise.resolve(resp) : Promise.reject(resp);
}

async function updateEntity(urlBase, entityName, entity) {
  const url = `${urlBase}${entityName}/${entity.id}`;
  const resp = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entity),
  });
  return resp.ok ? Promise.resolve(resp) : Promise.reject(resp);
}

async function createEntity(urlBase, entityName, entity) {
  const url = `${urlBase}${entityName}`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entity),
  });
  return resp.ok ? Promise.resolve(resp) : Promise.reject(resp);
}

async function deleteEntity(urlBase, entityName, id) {
  const url = `${urlBase}${entityName}/${id}`;
  const resp = await fetch(url, {
    method: 'DELETE',
  });
  return resp.ok ? Promise.resolve(resp) : Promise.reject(resp);
}

function encodeQueryData(data) {
  return Object.entries(data).reduce((accum, [k, v]) => `${accum}&${encodeURIComponent(k)}=${encodeURIComponent(v)}`, '');
}

/**
 * Search API.
 *
 * @param:
 *  - domainClass:
 *  - searchTargetField:
 *  - query:
 *  - options:
 *    - results (opt)
 *    - associationString (opt)
 *    - sort (opt)
 *    - order (opt)
 *    - max (opt)
 *    - offset (opt)
 *    - distinct (opt)
 *
 */
async function search(urlBase, domainClass, searchTargetField, query, options = {}) {
  const url = `${urlBase}search?domainClass=${domainClass}&searchTargetField=${searchTargetField}&query=${query}`;
  const resp = await fetch(url + encodeQueryData(options), {
    method: 'GET',
  });
  return resp.ok ? Promise.resolve(resp) : Promise.reject(resp);
}

function searchById(urlBase, domainClass, id, options) {
  return search(urlBase, domainClass, 'id', id, options);
}

function searchByIds(urlBase, domainClass, ids, options) {
  return search(urlBase, domainClass, 'id', ids.join(','), options);
}

function createRestApi(urlBase, domainClass) {
  const entityName = domainClass.substring(domainClass.lastIndexOf('.') + 1, domainClass.length); // TODO: to be aware of resoruce mappng.

  return {
    getEntities: getEntities.bind(null, urlBase, entityName),
    getEntity: getEntity.bind(null, urlBase, entityName),
    updateEntity: updateEntity.bind(null, urlBase, entityName),
    createEntity: createEntity.bind(null, urlBase, entityName),
    deleteEntity: deleteEntity.bind(null, urlBase, entityName),
    search: search.bind(null, urlBase, domainClass),
    searchById: searchById.bind(null, urlBase, domainClass),
    searchByIds: searchByIds.bind(null, urlBase, domainClass),
  };
}

export default {
  createRestApi,
};
