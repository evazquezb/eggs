 const root = document.querySelector(':root');
 const beginnerButtons = document.querySelectorAll('.principiante>.container.buttons>div>button');
 const intermedioButtons = document.querySelectorAll('.intermedio>.container.buttons>div>button');
 const avanzadoButtons = document.querySelectorAll('.avanzado>.container.buttons>div>button');
 const levelButtons = document.querySelectorAll('.levelButton');
 const btnFlagMode = document.getElementById("btnFlagMode");
 const btnEasy = document.getElementById("btnEasy");
 const btnHard = document.getElementById("btnHard");
 const btnExpert = document.getElementById("btnExpert");
 const light = document.getElementById("light");
 const theme = document.getElementById("theme");
 const btnDarkMode = document.getElementById("btnDarkMode");
 const divFlagZone = document.getElementById("flagZone");
 const crackSound = document.getElementById("crackSound");
 const clickSound = document.getElementById("clickSound");
 const winSound = document.getElementById("winSound");
 const loseSound = document.getElementById("loseSound");
 const errorSound = document.getElementById("errorSound");
 const timer = document.getElementById("timer");
 const btnInstall = document.getElementById("btnInstall");
 const flags = document.getElementById("flags");
////////////
///METODOS//
////////////

//--para obtener los botones de la seccion del nivel actual
export const actualButtonsSection = actualLevel => {
    //buscamos la seccion del dom correspondiente al nivel
    const screen = document.querySelector(`.${actualLevel.level}`);
    //buscamos las seccion de screen correspondiente a la info
    const buttonsSection = screen.querySelector('.container.buttons');
    //console.log(buttonsSection);
    return buttonsSection;
}


 export const dom = { root,beginnerButtons,intermedioButtons,avanzadoButtons,
    levelButtons,btnFlagMode,btnEasy,btnHard,btnExpert,
    light,theme,btnDarkMode,crackSound,clickSound,winSound,loseSound,errorSound,timer,btnInstall,
    divFlagZone, actualButtonsSection,flags }
