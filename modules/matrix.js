'use strict';
import {util} from "./util.js";

//arreglo para determinar fila y columna de las posiciones
//alrededor de otra
const aroundPattern = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];

//Llena de zeros una matriz
const fillZeros = function(rows,columns){
    this.length = 0;
    for(let x=0;x<rows;x++){
        const fila = [];
        for(let y=0;y<columns;y++){
            fila.push(0);
        }
        this.push(fila);
    }
    return this;
}

//llena x cantidad posiciones aleatorias de un elemento especificado
const fillRandomPositions = function (quantity,element) {
    let coordenada;
    const positions = [];
    try {
        for (let i = 0; i < quantity; i++) {
            coordenada = util.randomPosition(this.length,this[0].length);
            while (this[coordenada[0]][coordenada[1]] == element) {
                coordenada = util.randomPosition(this.length,this[0].length);
            }
            this[coordenada[0]][coordenada[1]] = element;
            positions.push(coordenada);
        }
        return positions;
    } catch (e) {
        console.log(e);
        return false;
    }
}

//devuelve las posiciones alrededor de una coordenada dada en una matriz
function aroundPositions(position,array){
    const aroundPositions = [];
    const rows = array.length;
    const columns = array[0].length;
    for(let r = 0; r<aroundPattern.length; r++){
        const coordenada = [position[0]+aroundPattern[r][0],position[1]+aroundPattern[r][1]];
        if (coordenada[0]<0 || coordenada[1]<0)
            continue;
        aroundPositions.push(coordenada);
    }
    return aroundPositions.filter(position=>position[0]<rows && position[1]<columns);
}

//coloca en cada posicion de una matriz, la cantidad de elementos "x" que le rodean
function howMuchAround(elemento){
    const rows = this.length;
    const columns = this[0].length;
    
    for(let r = 0; r<rows; r++){
        if(this[r].includes(elemento)){
            for(let c=0;c<columns;c++){
                if(this[r][c]==elemento){
                    const positions = aroundPositions([r,c],this).filter(position=>
                        this[position[0]][position[1]]!=elemento);
                    positions.forEach(position=>this[position[0]][position[1]]+=1);
                }
            }
        }
    }
}
//exportamos un objeto con las metodos creados
export const matrix = {fillZeros, fillRandomPositions, aroundPositions, howMuchAround}