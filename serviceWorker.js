//importamos: un objeto con métodos para
//            -guardar archivos en cache
//            -retornar una respuesta desde la cache
//            -eliminar todas las caches excepto la actual
//            -eliminar una cache en especifico
import { cache } from "./swModules/cache.js";

//agregamos el manejador al evento install  service worker;
self.addEventListener('install', event => event.waitUntil(cache.save('mines-v006')) );

//agregamos el manejador al evento activate del service worker
self.addEventListener('activate',event => event.waitUntil(cache.clearAll()) );

//agregamos el manejador al evento fetch 
self.addEventListener('fetch', event => event.respondWith(cache.response(event)) );












