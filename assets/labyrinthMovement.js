import Labyrinth from './labyrinth.js'

class LabyrinthMovement{
    constructor(){
        this.characters = Labyrinth.getCharacters();
        this.initialState = Labyrinth.getInitialState();
        this.finalState = Labyrinth.getFinalState();
        this.currentState = {}
        this.currentStateElement = null;
    }

    startMovement(){
        // hardcodeamos el actual para empezar a trabajar
        // LABYRINTH MOVEMENT SE DEBE EJECUTAR HASTA QUE LE DES INICIAR AL LABERINTO
        this.currentState = {
            row: 0,
            column: 0
        }
    }

    drowState(i,j){
        // dibujamos el estado actual.
        // despintamos el anterior actual
        
    }
}

export default LabyrinthMovement;