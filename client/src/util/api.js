async function getEntities(urlBase, entityName) {
  const url = `${urlBase}${entityName}?max=100`;
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
  const url = `${urlBase}${entityName}/${id}.json`;
  const resp = await fetch(url, {
    method: 'DELETE',
  });
  return resp.ok ? Promise.resolve(resp) : Promise.reject(resp);
}

export default function createRestApi(urlBase, entityName) {
  return {
    getEntities: getEntities.bind(null, urlBase, entityName),
    getEntity: getEntity.bind(null, urlBase, entityName),
    updateEntity: updateEntity.bind(null, urlBase, entityName),
    createEntity: createEntity.bind(null, urlBase, entityName),
    deleteEntity: deleteEntity.bind(null, urlBase, entityName),
  };
}
