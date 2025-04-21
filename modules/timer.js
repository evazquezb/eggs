import {dom} from "./dom.js";
let startTime;
let animationFrame;

function frame(time){
    const elapsed = time - startTime;
    const seconds = Math.round(elapsed/1000);
    timer.time = seconds;
    updateUI(seconds);
    const nextTarget = (seconds+1) * 1000 + startTime;
    setTimeout(()=>{
        if(startTime)
        animationFrame = requestAnimationFrame(frame);
    },nextTarget - performance.now());

}

function updateUI(seconds){
    dom.timer.innerHTML = seconds; 
}
export const timer = {
    value : null,
    start : function(){
        startTime = document.timeline.currentTime;
        frame(startTime);
        return true;
    },
    stop : function(){
        cancelAnimationFrame(animationFrame);
        startTime = null;
        animationFrame = null;
        this.time = null;
        return false;
    },
    updateUI,
    get time() { return this.value},
    set time(val) {this.value = val}
}
