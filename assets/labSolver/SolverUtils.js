import Labyrinth from '../labyrinth.js';
import LabState from './LabState.js';
import LabGraph from './LabGraph.js';


class SolverUtils{
    constructor (){
        this.currentState = {};
        this.visitNumber = 1;
        this.labGraph = new LabGraph();
    }

    setCurrentState(currentState){
        this.currentState = currentState;
    }

    setVisitNumber(visitNumber){
        this.visitNumber = visitNumber;
    }

    getLabGraph(){
        return this.labGraph;
    }

    addToGraph(state, parent, Gn = null, Hn = null){
        // el mismo estado podría estar más de una vez en el grafo
        // a la key le vamos a agreguar un id
        // para diferenciar los estados iguales
        //state.id = this.getStateId(state);
        // en state tengo solo la coordenada de la casilla a agregar al grafo,
        // hay que obtener sus datos como su peso
        if(!this.isInGraphByState(state)){
            const visited = false;
            const weight = this.getStateWeight(state);
            const name = this.getStateName(state);
            const labState = new LabState(state, parent, visited, weight, Gn, Hn, name);
            this.labGraph.addState(state, labState);
        }
        //console.log(this.labGraph);
        //return state;
    }

    removeFromGraph(state){
        this.labGraph.removeState(state);
    }

    addVertexToGraph(stateA, stateB){
        this.labGraph.addVertex(stateA, stateB);
    }

    isInGraphByState(state){
        return this.labGraph.stateInGraph(state);
    }

    getStateId(state){
        // esta función es para cuando el mismo estado está en dos o más nodos del grafo
        // el id es para diferenciar esos nodos iguales
        if(!this.isInGraphByState(state)){
            // si no está en el grafo, regresamos 0
            return 0;
        }
        // si está en el grafo tenemos que obtener el id del último nodo igual
        // y regresamos ese id + 1
        const nodes = this.getNodesFromGraph(state);
        var max = nodes[0].id;
        for(let i = 0; i < nodes.length; i++){
            if(nodes[i].id > max){
                max = nodes[i].id;
            }
        }
        return max + 1;
    }

    getNodesFromGraph(state){
        const states = this.labGraph.getLabStates();
        const nodes = [];
        for(var labState of states){
            if(labState[0].row === state.row && labState[0].column === state.column){
                nodes.push(labState[0]);
            }
        }
        return nodes;
    }

    addVisitOrder(state){
        this.labGraph.addToVisitOrder(state);
    }

    getVisitOrder(){
        return this.labGraph.getVisitOrder();
    }

    markStateAsVisited(state){
        this.labGraph.setStateAsVisited(state);
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

    getParentGn(state){
        const parentGn = this.labGraph.getParentGn(state);
        //console.log("returning from solver utils: ", parentGn);
        return parentGn;
    }

    getTerrainId(state){
        return Labyrinth.getFileArray()[state.row][state.column];
    }

    getGn(state){
        return this.labGraph.getGn(state);
    }

    getHn(state){
        return this.labGraph.getHn(state);
    }

    getCurrentCharacter(){
        return Labyrinth.getCurrentCharacter();
    }

    getStateName(state){
        const row = state.row + 1;
        const column =  String.fromCharCode(state.column + 65);
        return column + "," + row;
    }

    changeState(newState){
        this.eraseState(this.currentState);
        this.drawState(newState);
        this.currentState = newState;
        // le decimos a Labyrinth que hay un nuevo final
        Labyrinth.setCurrentState(this.currentState);

        // agregamos al orden de visita
        this.addVisitOrder(this.currentState);

        // dibujamos la visita
        this.drawVisit(this.currentState);
        this.visitNumber++;
    }

    addVisitNumber(state, visitNumber){
        this.labGraph.addVisitNumber(state, visitNumber);
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
            visit.innerHTML += this.visitNumber;
        }else{
            // no es el primero, dibujamos coma
            visit.innerHTML += "," + this.visitNumber;
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

    drawGraph(container, routeToFinal){
        this.labGraph.drawGraph(container, routeToFinal);
        this.drawRouteInLabyrinth(routeToFinal);
    }

    drawRouteInLabyrinth(routeToFinal){
        var cost = 0;
        for(let i = 0; i < routeToFinal.length; i++){
            const cell = document.getElementById("cell" + routeToFinal[i].row + "," + routeToFinal[i].column);
            cell.style.backgroundColor = "#D4EFBF";
            if(i !== 0){
                // hay que contar el costo de la solución. El primer nodo no cuenta.
                cost = cost + this.getStateWeight(routeToFinal[i]);
            }
        }
        const costDiv = document.getElementById("solutionCost");
        costDiv.innerHTML = '<h1 style="text-align: center">Costo de solución: ' + cost + '</h1>';
    }
    
    getRouteToFinal(initialState, finalState){
        var routeToFinal = [];
        // tenemos que ir al estado final del grafo y conseguir a su nodo padre
        // del nodo padre obtenemos también su padre
        // y así hasta llegar al nodo inicial.
        var currentNode = this.getLabState(finalState);
        console.log(currentNode);
        var currentState = currentNode.state;
        routeToFinal.unshift(currentState);
        while(currentState != initialState){
            currentNode = this.getLabState(currentNode.parent);
            currentState = currentNode.state;
            routeToFinal.unshift(currentState);
        }
        return routeToFinal;
    }

    getLabState(state){
        var labState = {};
        for(var [key, value] of this.labGraph.labStates){
            if(key.row === state.row && key.column === state.column){
                labState = value;
                break;
            }
        }
        return labState;
    }

    clearVars(){
        this.currentState = {};
        this.visitNumber = 1;
        this.labGraph.clearVars();
    }
}

export default SolverUtils;