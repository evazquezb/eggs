'use strict'
//funcion que devuelve si el navegador es un movil
const info = window.navigator.userAgentData || window.navigator.userAgent;
const movil = info.mobile || (info.platform == "") || (typeof info === 'string' && info.includes("Mobile"))
    ? true : false;
//devuelve un numero random, en un rango.
const random = (a, b = 0) => {
    const to = Math.max(a, b);
    const from = Math.min(a, b);
    return Math.floor(Math.random() * (to - from) + from);
}
//devuelve una posicion aleatoria en una matriz
const randomPosition = (rows,columns) => [random(0,rows),random(0,columns)];

//recibe segundos devuelve cadena de tiempo
const secondsToTime = function(seconds){
    const segundos = seconds % 60 + " segundos";
    const minutos = Math.trunc(seconds / 60) % 60 > 0 ? Math.trunc(seconds / 60) % 60 + " minutos" : "";
    const horas = Math.trunc(seconds / 3600) % 24 > 0 ? Math.trunc(seconds / 3600) % 24 + " horas" : "";
    const dias = Math.trunc(seconds / 86400) % 365 > 0 ? Math.trunc(seconds / 86400) % 365 + " días" : "";
    const anos = Math.trunc(seconds / 31536000) % 100 > 0 ? Math.trunc(seconds / 31536000) % 100 + " años" : "";
    const siglos = Math.trunc(seconds / 3153600000) % 1000 > 0 ? Math.trunc(seconds / 3153600000) % 1000 + " siglos" : "";

    return `${siglos} ${anos} ${dias} ${horas} ${minutos} ${segundos}`.trim();
}

export const publicVapidToUint8Array = function(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export const util = {movil,random,randomPosition,secondsToTime,publicVapidToUint8Array}
