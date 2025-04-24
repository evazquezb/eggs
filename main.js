//importaciones
import { util } from "./modules/util.js";
import { matrix } from "./modules/matrix.js";
import { checkWin } from "./modules/checkWin.js";
import { boton } from "./modules/boton.js";
import { dom } from "./modules/dom.js";
import { clearButtons } from "./modules/clearButtons.js";
import { timer } from "./modules/timer.js";
import { notifies } from "./modules/notifications.js";
try {
    //referencias para service worker
    const public_vapid_key = "BFvd00R-Home9hrCmVioSGtXK7v0e8VsEv0GI39WyG93dy6z8gAL5hRZqM7YCrovjkYmJH9PJVZHfhjJ5DAeWCs"
    let swRegistration;
    let subscription;

    //registramos worker
    if (navigator.serviceWorker) {
        navigator.serviceWorker.register("./serviceWorker.js", { type: 'module' }).then(result => {
            swRegistration = result;
        })
    }
    const notifications = Reflect.has(window, "Notification") ? notifies.permission.get() : null;

    //creamos objetos que representan niveles del juego
    const level1 = {
        level: "Easy", rows: 8, columns: 8, eggs: 10, cellsToClear: 54, cellsCleared: 0, flagged: 0,
        win: false, lose: false, playing: false,animating:false, eggsToExplote: 10, eggsChecked: 0, eggsExploted: 0
    }
    const level2 = {
        level: "Hard", rows: 16, columns: 10, eggs: 32, cellsToClear: 128, cellsCleared: 0, flagged: 0,
        win: false, lose: false, playing: false,animating:false, eggsToExplote: 32, eggsChecked: 0, eggsExploted: 0
    }
    const level3 = {
        level: "Expert", rows: 16, columns: 12, eggs: 50, cellsToClear: 192, cellsCleared: 0, flagged: 0,
        win: false, lose: false, playing: false,animating:false, eggsToExplote: 45, eggsChecked: 0, eggsExploted: 0
    }

    //referencias para control del juego y ui
    let actualLevel = JSON.parse(localStorage.getItem("actualLevel")) || level1;
    let darkMode = false;
    let flag = false;
    let eggsPositions;
    let installPrompt = null;
    const data = [];

    //asignamos propiedades importadas de matrix.js a nuestro data (arreglo) ;
    Object.defineProperty(data, "howMuchAround", { value: matrix.howMuchAround, writable: false });
    Object.defineProperty(data, "fillZeros", { value: matrix.fillZeros, writable: false });
    Object.defineProperty(data, "fillRandomPositions", { value: matrix.fillRandomPositions, writable: false });
    Object.defineProperty(data, "getReady", {
        value: function () {
            this.fillZeros(actualLevel.rows, actualLevel.columns);
            eggsPositions = this.fillRandomPositions(actualLevel.eggs, 9);
            this.howMuchAround(9);
        }, writable: false
    });

    ///////////////
    //--funciones//
    ///////////////
    //--para iniciar el juego
    function start(level) {
        actualLevel = level;
        //visualizamos area según nivel;
        document.querySelectorAll('section').forEach(section => section.style.display = "none");
        document.querySelector(`.${actualLevel.level}`).style.display = "block";
        //reseteamos botones
        clearButtons(actualLevel, act);
        //preparamos matriz
        data.getReady();
        //limpiamos propiedades del nivel;
        actualLevel.flagged = 0;
        actualLevel.animating = false;
        actualLevel.cellsToClear = actualLevel.rows * actualLevel.columns - actualLevel.eggs;
        actualLevel.lose = false;
        actualLevel.win = false;
        actualLevel.eggsChecked = 0;
        actualLevel.eggsExploted = 0;
        actualLevel.eggsToExplote = actualLevel.eggs;
        actualLevel.cellsCleared = 0;
        localStorage.setItem("actualLevel", JSON.stringify(actualLevel));
        navigator.serviceWorker.ready.then(
            swRegistration => swRegistration.getNotifications().then(notifications =>
                notifications.forEach(notification => {
                    if (notification.tag == "end")
                        return notification.close();
                }
                )
            )

        );
        actualLevel.playing = timer.stop();
        timer.updateUI(0);
        return true;
    }

    //--para explotartodas los huevos cuando pierdes
    const exploteEggs = function () {
        actualLevel.animating = true;
        if (notifications === "granted" && !util.movil) {
            swRegistration.showNotification("Chiiiin!", {
                body: `intenta de nuevo el nivel ${actualLevel.level}`,
                image: "./imgs/lose.jpg",
                icon: "./imgs/vsoft.png",
                tag: "end"
            }).then(() =>
                swRegistration.getNotifications()).then(notifications =>
                    notifications.forEach(notification => {
                        if (notification.tag == "end")
                            return setTimeout(() => notification.close(), 3000);
                    }
                    )
                );
        }
        const coordenada = boton.position.call(this);
        clearCell.call(this, true);
        exploteEgg.call(this, true);
        actualLevel.eggsExploted += 1;
        let timingAnimation = 0;
        const minas = eggsPositions.filter(position => position[0] != coordenada[0] || position[1] != coordenada[1]);
        minas.forEach(position => {
            timingAnimation += 10;
            const button = dom.actualButtonsSection(actualLevel).querySelector((`#_${position[0]}>#_${position[1]}`));
            button.style.backgroundImage = "url(./imgs/mina.png)";
            setTimeout(() => {
                clearCell.call(button, true);
                if (!boton.flag.call(button)) {
                    actualLevel.eggsExploted += 1;
                    return exploteEgg.call(button);
                }
            }, timingAnimation);

        });
        timingAnimation = 0;
        const buttons = dom.actualButtonsSection(actualLevel).querySelectorAll('button');
        Array.from(buttons).filter(button => {
            const position = boton.position.call(button);
            return data[position[0]][position[1]] == 0;
        }).forEach(button => {
            timingAnimation += 20;
            return setTimeout(clearCell.bind(button), timingAnimation);
        });
    }

    //--para explotar una mina
    const exploteEgg = function (focus) {
        this.style.animation = "explote 0.5s 1 linear";
        setTimeout(() => {
            dom.crackSound.play();
            this.style.backgroundImage = "url('./imgs/exploted.png')";
            if (focus) this.classList.add("focus");
            this.style.animation = "none";
            actualLevel.eggsChecked += 1;
            if (actualLevel.eggsToExplote == actualLevel.eggsChecked) {
                actualLevel.animating = false;
                actualLevel.lose = true;
                actualLevel.playing = timer.stop();
                document.querySelector("#btn" + actualLevel.level).classList.remove('pushed');
            }
        }, 50);
    }

    //--para checar jugada y actuar
    function act(e) {
        try {
            if(actualLevel.lose || actualLevel.win) return false;
            if (!actualLevel.playing) {
                actualLevel.playing = timer.start();
            }
            if (e.button == 2 || flag) {
                return boton.putFlag.call(this, actualLevel, data, clickSound) ? win() : true;
            }
            const flagged = boton.flag.call(this);
            const coordenada = boton.position.call(this);
            if (!flag && flagged) return false;
            if (data[coordenada[0]][coordenada[1]] == 9) {
                this.style.backgroundImage = "url('./imgs/mina.png')";
                dom.crackSound.play()
                return exploteEggs.call(this);
            }
            dom.clickSound.play()
            return clearCell.call(this, data[coordenada[0]][coordenada[1]] == 0);

        } catch (e) {
            console.log(e)
        }
    }

    //--para mostrar su contenido de celda y actuar dependiendo del mismo
    const clearCell = function (clearAround) {
        const coordenada = boton.position.call(this);
        const content = data[coordenada[0]][coordenada[1]];
        const flagged = boton.flag.call(this);
        if (content == 11) return;
            if (flagged) {
                if(actualLevel.animating || actualLevel.lose){
                    this.style.backgroundImage = data[coordenada[0]][coordenada[1]] == 9 ?
                    "url(./imgs/mina.png),url(./imgs/flag.png)":
                    "url(./imgs/wrongFlag.png)";
                    this.classList.add("pressed");   
                    }
            } else {
                if (data[coordenada[0]][coordenada[1]] != 9) {
                    actualLevel.cellsCleared += 1;
                }
                this.innerHTML = `<span class='_${content}'>${content > 0 && content < 9 ? content : ""}</span>`;
                this.removeEventListener('click', act);
                this.removeEventListener('contextmenu', act);
                this.classList.add("pressed");
                data[coordenada[0]][coordenada[1]] = 11;
            }
            
        data[coordenada[0]][coordenada[1]] = data[coordenada[0]][coordenada[1]] == 0 ?
            10 : data[coordenada[0]][coordenada[1]];
        if(clearAround && !actualLevel.win){setTimeout(clearAroundEmptys.bind(this), 50)};
        if(checkWin(actualLevel)) return win();
    }

    //--para limpiar celdas vacías alrededor de una posicion si esta vacia
    function clearAroundEmptys() {
        const coordenada = boton.position.call(this);
        let aroundEmptyCell = matrix.aroundPositions([coordenada[0], coordenada[1]], data);
        aroundEmptyCell = aroundEmptyCell.filter(cell => data[cell[0]][cell[1]] != 9);
        aroundEmptyCell.forEach(position => {
            const button = dom.actualButtonsSection(actualLevel).querySelector(`#_${position[0]}>#_${position[1]}`);
            clearCell.call(button, data[position[0]][position[1]] == 0);
        });
        return true;
    }
    //para setear nivel y comenzar a jugar
    function level() {
        if(actualLevel.animating) return false;
        if(actualLevel.playing){
            const sure = window.confirm('Are you sure');
            if(!sure) return;
        }
        dom.levelButtons.forEach(button => button.classList.remove("pushed"));
        this.classList.add("pushed");
        return start(this == dom.btnEasy ? level1 : this == dom.btnHard ? level2 : level3);
    }
    //para anunciar victoria
    function win() {
        const time = timer.time;
        actualLevel.playing = timer.stop();
        dom.winSound.play();
        actualLevel.win = true;
        if (flag) btnFlagMode.click();
        document.querySelector("#btn" + actualLevel.level).classList.remove('pushed');
        if (notifications === "granted" && !util.movil) {
            swRegistration.showNotification("Nos salvaste!", {
                body: `Ganaste el nivel ${actualLevel.level} 
        en ${util.secondsToTime(time)}`,
                image: "./imgs/win.jpg",
                icon: "./imgs/vsoft.png",
                tag: "end"
            }).then(() =>
                swRegistration.getNotifications()).then(notifications =>
                    notifications.forEach(notification => {
                        if (notification.tag == "end")
                            return setTimeout(() => notification.close(), 3000);
                    }
                    )
                )
        } else {
            alert(`Ganaste el nivel ${actualLevel.level} en ${util.secondsToTime(time)}`)
        }
        //setTimeout(()=>gameOverNotification.close(),4000);
        return true;
    }
    //para instalar juego
    async function install() {
        try {
            this.removeEventListener('click', install);
            if (!installPrompt) return false;
            try {
                if (!subscription) {

                    if (notifications) {
                        subscription = await swRegistration.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: util.publicVapidToUint8Array(public_vapid_key)
                        });
                    } else {
                        throw Error("obsolete");
                    }
                }
            } catch (error) {
                this.addEventListener('click', install);
                return alert(error.message == "obsolete" ?
                    "Sorry, the navigator isn't support notifications" :
                    "You need to allow notifications");
            }
            const installation = await installPrompt.prompt();
            if (installation.outcome == "accepted") {
                this.style.display = "none";
            } else {
                this.addEventListener('click', install);
            }
        } catch (error) {
            this.addEventListener('click', install);
            return alert("Installation time expired. \n Please try again");
        }

    }

    /////////////////////////////////
    //Agregar Manejadores de eventos//
    /////////////////////////////////

    dom.btnFlagMode.addEventListener('click', () => {
        flag = !flag;
        light.style.opacity = flag ? 1 : 0;
    });

    dom.levelButtons.forEach(function(button){
        button.addEventListener('click', level);
    });

    dom.btnDarkMode.addEventListener('click', function () {
        darkMode = !darkMode;
        if (darkMode) {
            dom.root.style.setProperty('--bodyBgColor', '#000');
            dom.root.style.setProperty('--buttonsColor', '#666');
            dom.root.style.setProperty('--buttonsBorderColorA', '#888');
            dom.root.style.setProperty('--buttonsBorderColorB', '#333');
            theme.content = "#000";  
            this.textContent = "Ligth";
        } else {
            dom.root.style.setProperty('--bodyBgColor', '#999');
            dom.root.style.setProperty('--buttonsColor', '#aaa');
            dom.root.style.setProperty('--buttonsBorderColorA', '#fff');
            dom.root.style.setProperty('--buttonsBorderColorB', '#888');
            theme.content = "#888";
            this.textContent = "Dark";
        }
    });
    dom.btnInstall.addEventListener('click', install);
    window.addEventListener('contextmenu', e => {
        e.preventDefault();
        return false;
    });
    window.addEventListener('beforeinstallprompt', event => {
        event.preventDefault();
        dom.btnInstall.style.display = "block";
        installPrompt = event;
        return installPrompt;
    });
    /////////////////////////////////
    //INICIALIZACIONES             //
    /////////////////////////////////
    if (util.movil) {
        dom.divFlagZone.style.display = "block";
    }
    start(actualLevel);
} catch (e) {
    console.log(e);
}