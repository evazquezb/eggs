//importamos un arreglo que contendrá los nombres
//de los archivos a guardar en cahe
import { arrayDocuments } from "./arrayDocuments.js";
//import
import { errorPage } from "./errorPage.js";
//declaramos referencia que guardará el nombre de cache que usamos para guardar
//los archivos al momento de instalarse el service worker;
let expectedCache;
//Creamos función que guardará los archivos en cache
//al instalarse el service worker
const save = async (cacheNameToSave) => {
    //guardamos el nombre en la referencia expectedCache
    expectedCache = cacheNameToSave
    //creamos la cache y agregamos los archivos cuyos nombres están en arrayDocuments
    await caches.open(expectedCache).then(cache => cache.addAll(arrayDocuments));
}
//Creamos funcion que retorna una promesa de limpieza de caches 
//en este caso borra todas exepto la recién creada
const clearAll = async () => Promise.all(
    await caches.keys().then(
        cacheNames => cacheNames.map( 
            cacheName => cacheName != expectedCache ? clear(cacheName) : false
        )
    )
);
//retorna los archivos desde cache al hacer peticiones(fetch)
const response = async event => {
    const url = new URL(event.request.url);
    return await caches.match(url).then(checkCacheResponse.bind(url)); 
}
//checa respuesta ok de un fetch
//si es falso devuelve una respuesta de error 
const checkFetched = response => response.ok ? response : errorFetchedResponse();
//si estamos offline cargamos index del cache
function errorFetchedResponse(){
    return new Response(new Blob(errorPage,{type:"text/html"}))
}
//checa respuesta de cache
//si es undefined hace un fetch
async function checkCacheResponse(cacheResponse){
    return cacheResponse || await fetch(this).then(checkFetched,errorFetchedResponse);
}                          
//retorna una promesa de limpiado de cache
const clear = cacheName => caches.delete(cacheName);
//exportamos objeto "cache"
export const cache = { save, clearAll, response, clear}
