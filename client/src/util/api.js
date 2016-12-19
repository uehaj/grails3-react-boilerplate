const urlBase = 'http://localhost:8080/';

async function getEntities(entityName) {
  const url = `${urlBase}${entityName}?max=100`;
  const resp = await fetch(url, {
    method: 'GET',
  });
  return resp.ok ? Promise.resolve(resp) : Promise.reject(resp);
}

async function getEntity(entityName, id) {
  const url = `${urlBase}${entityName}/${id}`;
  const resp = await fetch(url, {
    method: 'GET',
  });
  return resp.ok ? Promise.resolve(resp) : Promise.reject(resp);
}

async function updateEntity(entityName, entity) {
  const url = `${urlBase}${entityName}/${entity.id}`;
  const resp = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entity),
  });
  return resp.ok ? Promise.resolve(resp) : Promise.reject(resp);
}

async function createEntity(entityName, entity) {
  const url = `${urlBase}${entityName}`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entity),
  });
  return resp.ok ? Promise.resolve(resp) : Promise.reject(resp);
}

async function deleteEntity(entityName, id) {
  const url = `${urlBase}${entityName}/${id}.json`;
  const resp = await fetch(url, {
    method: 'DELETE',
  });
  return resp.ok ? Promise.resolve(resp) : Promise.reject(resp);
}

export default function createRestApi(entityName) {
  return {
    getEntities: getEntities.bind(null, entityName),
    getEntity: getEntity.bind(null, entityName),
    updateEntity: updateEntity.bind(null, entityName),
    createEntity: createEntity.bind(null, entityName),
    deleteEntity: deleteEntity.bind(null, entityName),
  };
}

