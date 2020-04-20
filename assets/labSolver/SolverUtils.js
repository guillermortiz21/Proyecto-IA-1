import Labyrinth from '../labyrinth.js';
import LabState from './LabState.js';


class SolverUtils{
    constructor (){
        this.currentState = {};
        this.visit = 1;
    }

    setCurrentState(currentState){
        this.currentState = currentState;
    }

    setVisit(visit){
        this.visit = visit;
    }

    addToGraph(labGraph, state, arriveCost){
        // en state tengo solo la coordenada de la casilla a agregar al grafo,
        // hay que obtener sus datos como su peso
        const visited = false;
        const weight = this.getStateWeight(state);
        const labState = new LabState(state, visited, weight, arriveCost);
        labGraph.addState(labState);
    }

    getStateWeight(state){
        const terrainId = this.getTerrainId(state);
        const character = this.getCurrentCharacter();
        var weight = null;
        // iterar a través de arreglo de pesos del personaje hasta encontrar el id del terreno de state.
        // al encontrarlo, obtener el peso
        for(let i = 0; i < character.weights.length; i++){
            if(character.weights[i].terrainId === terrainId){
                weight = character.weights[i].weight;
            }
        }
        return weight;
    }

    getTerrainId(state){
        return Labyrinth.getFileArray()[state.row][state.column];
    }

    getCurrentCharacter(){
        return Labyrinth.getCurrentCharacter();
    }

    changeState(newState){
        this.eraseState(this.currentState);
        this.drawState(newState);
        this.currentState = newState;
        // le decimos a Labyrinth que hay un nuevo final
        Labyrinth.setCurrentState(this.currentState);

        // dibujamos la visita
        this.drawVisit(this.currentState);
        this.visit++;
    }

    eraseState(state){
        const cell = this.getCharacterCell(state);
        cell.style.visibility = "hidden";
    }

    drawState(state){
        const cell = this.getCharacterCell(state);
        cell.style.visibility = "visible";
    }

    getCharacterCell(state){
        return document.getElementById("characterContainer" + state.row + "," + state.column);
    }

    drawVisit(state){
        const cell = Labyrinth.getLabyrinthElement("cell", state.row, state.column);
        const visit = cell.getElementsByClassName("visit")[0];
        if(visit.innerHTML === ""){
            // es el primer elemento, no dibujamos coma
            visit.innerHTML += this.visit;
        }else{
            // no es el primero, dibujamos coma
            visit.innerHTML += "," + this.visit;
        }
    }

    isFinalState(state){
        const finalState = Labyrinth.getFinalState();
        return (state.row === finalState.row && state.column === finalState.column);
    }   

    getAdjacents(state){
        const searchOrder = Labyrinth.getSearchOrder();
        const adjacents = [];
        var adjacent = {};
        for(let i = 0; i < searchOrder.length; i++){
            if(searchOrder[i] == "up"){
                adjacent = {
                    row: state.row - 1,
                    column: state.column
                };
            }else if(searchOrder[i] == "right"){
                adjacent = {
                    row: state.row,
                    column: state.column + 1
                };
            }else if(searchOrder[i] == "down"){
                adjacent = {
                    row: state.row + 1,
                    column: state.column
                };
            }else if(searchOrder[i] == "left"){
                adjacent = {
                    row: state.row,
                    column: state.column - 1
                };
            }
            adjacents.push(adjacent);
        }
        return adjacents;
    }

    isValidAdjacent(state, visitedNodes){
        // validamos primero que el row y column estén dentro de los límites del laberinto
        const insideLabyrinth = this.isInsideLabyrinth(state);
        if(!insideLabyrinth){
            //console.log(state, "fuera del laberinto");
            return false;
        }

        // validamos que ese estado no esté visitado
        const visited = this.isVisisted(state, visitedNodes);
        if(visited){
            //console.log(state, "visitado");
            return false;
        }

        // validamos que el ser actual pueda estar en ese estado
        const canBeInStage = this.characterCanBeInState(state);
        if(!canBeInStage){
            //console.log(state, "n/a");
            return false;
        }

        return true;
    }

    isInsideLabyrinth(state){
        const minRow = 0;
        const maxRow = Labyrinth.getRowNumber() - 1;
        const minColumn = 0;
        const maxColumn  = Labyrinth.getColumnNumber() - 1;
        if(state.row < minRow || state.row > maxRow || state.column < minColumn || state.column > maxColumn){
            return false;
        }
        return true;
    }

    isVisisted(state, visited){
        var isVisited = false;
        for(let i = 0; i < visited.length; i++){
            if(state.row == visited[i].row && state.column == visited[i].column){
                isVisited = true;
                break;
            }
        }
        return isVisited;
    }

    characterCanBeInState(state){
        const weight = this.getStateWeight(state);
        if(weight === -1){
            return false;
        }
        return true;
    }
}

export default SolverUtils;