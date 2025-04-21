import { dom } from "./dom.js";
export const clearButtons = function(actualLevel,clear){ 
    const buttons = dom.actualButtonsSection(actualLevel).querySelectorAll(`button`);
    buttons.forEach(button=>{
        button.dataset.flag = "0";
        button.classList.remove("pressed","focus");
        button.style.backgroundImage="none";
        button.innerHTML=`${(button.parentNode.id).replace("_","")},${(button.id).replace("_","")}`;
        button.addEventListener('click',clear);
        button.addEventListener('contextmenu',clear);
    });
}