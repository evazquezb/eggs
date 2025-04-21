//-para saber si hay victoria
export const checkWin = actualLevel => 
    actualLevel.cellsCleared == actualLevel.cellsToClear ? 
    actualLevel.eggsExploted == 0 && actualLevel.flagged == actualLevel.eggs :
    false;
