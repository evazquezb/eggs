import { checkWin } from "./checkWin.js";
//retorna un array que representa coordenadas de la posicion 
//de un boton respecto a la matriz de datos del juego
//obtiene los datos de su id y del id de su contenedor padre en el html
//elimina el guión bajo y retorna solamente los numeros del id
const position = function getPosition(){
    return [Number(this.parentNode.id.replace('_','')),Number(this.id.replace('_',''))];
}
//retorna true|false que indica si el botón tiene bandera
//el dato lo obtine del atributo [data-flag] en el html del boton
const flag =  function(){ return !!Number(this.dataset.flag) }
//referencia al numero de banderas puestas;
let f = 0;
//coloca una bandera al boton, establece su data-flag en "1" en su html
//si ya tiene bandera la quita y su data-flag lo establece en "0"
//Checa si hay victoria cada que se ejecuta
const putFlag = function(actualLevel,data,clickSound){
    const coordenada = boton.position.call(this);
    const flagged = boton.flag.call(this);
    if (flagged==false) {

        this.style.backgroundImage = "url('./imgs/flag.png')";
        if(data[coordenada[0]][coordenada[1]]==9){
            actualLevel.flagged += 1; 
        }
        this.dataset.flag = "1";
        f += 1;
    }else {
        this.style.backgroundImage = "none";
        if(data[coordenada[0]][coordenada[1]]==9){
            actualLevel.flagged -= 1; 
        }
        this.dataset.flag = "0";
        f -= 1;
    }
    clickSound.play();
    actualLevel.eggsToExplote = actualLevel.eggs - actualLevel.flagged;
    return checkWin(actualLevel);
    
}

export const boton = { position, flag, putFlag, get flags(){return f}, set flags(x){ f = 0}}
