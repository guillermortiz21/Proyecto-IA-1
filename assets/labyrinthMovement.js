import Labyrinth from './labyrinth.js'

class LabyrinthMovement{
    constructor(){
        this.setKeyboardArrowListeners();
    }

    setVariables(){
        this.visit = 1;
        this.character = Labyrinth.getCurrentCharacter();
        this.initialState = Labyrinth.getInitialState();
        this.finalState = Labyrinth.getFinalState();
        this.minRow = 0;
        this.maxRow = Labyrinth.getRowNumber() - 1;
        this.minColumn = 0;
        this.maxColumn  = Labyrinth.getColumnNumber() - 1;
        this.currentState = {}
        this.currentStateElement = null;
    }

    getCurrentState(){
        return this.currentState;
    }

    startLabyrinth(){
        this.setVariables();
        this.currentState = {
            row: this.initialState.row,
            column: this.initialState.column
        }
        this.changeState(this.currentState.row, this.currentState.column);
    }

    finishLabyrinth(){
        this.currentState = {};
    }

    changeState(i,j){
        // esta función va a borrar del laberinto el último actual
        // va a volver a setear currentState
        // y va a dibujar el nuevo actual.

        // primero determino si el personaje puede ir a ese terreno
        const weight = this.getTerrainWeight(i,j);
        if(weight >= 0){
            this.eraseState(this.currentState.row, this.currentState.column);
            this.currentState = {
                row: i,
                column: j
            };
            this.drowState(i,j);
            Labyrinth.setCurrentState(this.currentState);
            Labyrinth.drawVisit(i,j, this.visit);
            this.visit++;
            if(this.checkIfFinalState()){
                alert("Has llegado al estado final!");
                this.finishLabyrinth();
                return;
            }
        }

    }

    drowState(i,j){
        // buscar el ser en en la celda i,j y cambiar su visibility a visible
        const cell = this.getCharacterCell(i,j);
        cell.style.visibility = "visible";
    }

    eraseState(i,j){
        // buscar el ser en en la celda i,j y cambiar su display a hidden
        const cell = this.getCharacterCell(i,j);
        cell.style.visibility = "hidden";
    }

    getCharacterCell(i,j){
        return document.getElementById("characterContainer" + i + "," + j);
    }

    checkIfFinalState(){
        return (this.currentState.row === this.finalState.row && this.currentState.column === this.finalState.column);
    }

    getTerrainWeight(i,j){
        // obtener la madtriz de terrenos
        const fileArray = Labyrinth.getFileArray();
        const terrainId = fileArray[i][j];
        var weight = null;
        // obtener cuánto le cuesta al personaje pasar por ese terrainId
        const weights = this.character.weights;
        for(let i = 0; i < weights.length; i++){
            if(weights[i].terrainId == terrainId){
                weight = weights[i].weight;
                break;
            }
        }
        return weight;
    }

    setKeyboardArrowListeners(){
        document.addEventListener('keydown', this.addListeners.bind(this), true);
    }

    addListeners(event){
        // los prevent dafault son para que la pantalla no haga scroll
        // con las teclas de arriba y abajo
        if(event.key === "ArrowUp"){
            event.preventDefault();
            this.moveUp();
        }
        if(event.key === "ArrowRight"){
            event.preventDefault();
            this.moveRight();
        }
        if(event.key === "ArrowDown"){
            event.preventDefault();
            this.moveDown();
        }
        if(event.key === "ArrowLeft"){
            event.preventDefault();
            this.moveLeft();
        }
    }

    statesSet(){
        return this.currentState;
    }

    moveUp(){
        if(this.statesSet()){
            const i = this.currentState.row;
            const j = this.currentState.column;
            if(i > this.minRow){ // solo me puedo mover a arriba si i es mayor a cero.
                this.changeState(i-1, j);
            }
        }
    }
    
    moveRight(){
        if(this.statesSet()){
            const i = this.currentState.row;
            const j = this.currentState.column;
            if(j < this.maxColumn){ // solo me puedo mover a la derecha si no he llegado al borde derecho
                this.changeState(i, j+1);
            }
        }
    }

    moveDown(){
        if(this.statesSet()){
            const i = this.currentState.row;
            const j = this.currentState.column;
            if(i < this.maxRow){ // solo me puedo mover para arriba si i es mayor a cero.
                this.changeState(i+1, j);
            }
        }
    }

    moveLeft(){
        if(this.statesSet()){
            const i = this.currentState.row;
            const j = this.currentState.column;
            if(j > this.minColumn){ // solo me puedo mover a la derecha si no he llegado al borde derecho
                this.changeState(i, j-1);
            }
        }
    }
}

export default LabyrinthMovement;