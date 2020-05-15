import Labyrinth from '../labyrinth.js';
import SolverUtils from './SolverUtils.js';

class UniformCost{
    constructor(){
        this.solverUtils = new SolverUtils();
        this.priorityQueue = []; // cola de prioridad del algoritmo. Va a guardar las coordenadas de los nodos
        this.visited = [];
        this.initialState = {};
        this.currentState = {};
        this.routeToFinal = [];
        this.finalState = {};
        this.finalStateFound = false;
        this.visitNumber = 0;
        this.waitTime = 500; // 1 segundo
    }

    async solve(){
        this.startSolver();

        // iteramos mientras la pila no esté vacía o mientras no lleguemos al estado final
        this.finalStateFound = false;
        while(this.priorityQueue.length > 0 && !this.finalStateFound){
            // seleccionamos nuestro nodo actual
            this.selectNode();

            //console.log(this.currentState);

            Labyrinth.drawColorCell(this.currentState);

            // revisamos si llegamos al estado final
            this.checkIfFinalState();
            if(this.finalStateFound){
                break;
            }

            // expandimos hijos.
            this.expand();
            
            // agregamos el actual a los visitados
            this.addToVisited();

            await this.wait(this.waitTime);
        }

        if(this.finalStateFound){
            this.routeToFinal = this.solverUtils.getRouteToFinal(this.initialState, this.finalState);
        }
        this.showResult();
        this.drawGraph();
        console.log(this.solverUtils.getLabGraph());
        console.log(this.solverUtils.getVisitOrder());
        
    }

    clearVars(){
        this.priorityQueue = [];
        this.visited = [];
        this.initialState = {};
        this.currentState = {};
        this.finalStateFound = false;
        this.solverUtils.clearVars();
        this.visitNumber = 0;
        this.routeToFinal = [];
    }

    startSolver(){
        this.clearVars();
        // obtener estado inicial
        this.initialState = Labyrinth.getInitialState();

        // obtener estado final
        this.finalState = Labyrinth.getFinalState();
        

        // iniciamos las visitas
        const firstVisit = 1;
        this.solverUtils.setVisitNumber(firstVisit);
        this.solverUtils.setCurrentState(this.initialState);

        // Agregamos el estado inicial al grafo, con un Gn de 0
        this.solverUtils.addToGraph(this.initialState, null, 0);

        // poner estado inicial en la cola de prioridad
        this.priorityQueue.push({
            state: this.initialState, 
            cost: 0
        });
    }

    selectNode(){
        // en busqueda uniforme se selecciona el primero en la cola.
        // colocamos al primero de la cola como el estado actual, y lo 
        // tenemos que revisar si es un nodo válido.
        this.currentState = this.priorityQueue.shift();
        this.currentState = this.currentState.state;
        while(!this.solverUtils.isValidAdjacent(this.currentState, this.visited)){
            this.currentState = this.priorityQueue.shift();
            this.currentState = this.currentState.state;
        }
        this.solverUtils.changeState(this.currentState);
        this.visitNumber++;
        this.solverUtils.addVisitNumber(this.currentState, this.visitNumber);
        this.addToVisited();
    }

    checkIfFinalState(){
        // vemos si el estado actual es el final
        if(this.solverUtils.isFinalState(this.currentState)){
            this.finalStateFound = true;
        }
    }   

    expand(){
        // obtenemos los candidatos a hijos del nodo
        // se obtienen respendando el orden de expansión
        const adjacents = this.solverUtils.getAdjacents(this.currentState);
        //console.log(adjacents);
        // revisar cada uno y determinar si es un hijo válido.
        // Hijo válido es que su peso no sea n/a y que no esté fuera del laberinto
        for(let i = 0; i < adjacents.length; i++){
            if(this.solverUtils.isValidAdjacent(adjacents[i], this.visited)){
                const Gn = this.getGn(adjacents[i]);
                // tabién hay que revisar que el estado no esté ya en el grafo
                if(!this.solverUtils.isInGraphByState(adjacents[i])){
                    // es un estado válido, lo agregamos al grafo
                    this.addState(adjacents[i], Gn);              
                }else{
                    // si el estado ya está en el grafo, hay que cuál tiene menor peso
                    // entre el adjacente que estoy evaluando y el que ya se encuentra en el grafo.
                    const inGraphCost = this.solverUtils.getGn(adjacents[i]);
                    if(Gn < inGraphCost){
                        console.log("eliminando rama");
                        // si el costo del adyacente que se está evaluando es menor que el costo del que ya estaba en el grafo
                        // hay que borrar el que ya está del grafo y de la cola.
                        // y hay que agregar el adyacente que se está evaluando.
                        this.removeFromPriorityQueue(adjacents[i]); // lo quitamos de la cola de prioridad
                        this.solverUtils.removeFromGraph(adjacents[i]);
                        // y agregamos el nuevo estado al grafo
                        this.addState(adjacents[i], Gn);
                    }
                }
            }
        }
    }

    addState(state, Gn){
        // agregamos el estado al grafo
        this.solverUtils.addToGraph(state, this.currentState, Gn);
    
        // creamos el vértice
        this.solverUtils.addVertexToGraph(this.currentState, state);

        // metemos el estado a la cola de forma prioritaria.
        this.addToPriorityQueue(state, Gn);
    }

    getGn(state){
        if(this.visitNumber === 0){
            return 0;
        }
        const parentGn = this.solverUtils.getGn(this.currentState);
        const stateWeight = this.solverUtils.getStateWeight(state);
        return parentGn + stateWeight;
    }

    addToPriorityQueue(state, Gn){
        // hay que iterar a través de la cola de prioridad hasta encontrar un nodo con peso 
        var found = false;
        for(let i = 0; i < this.priorityQueue.length; i++){
            if(this.priorityQueue[i].cost > Gn){
                // i es la posición donde insertar este nuevo nodo.
                this.priorityQueue.splice(i, 0, {state: state, cost: Gn});
                found = true;
                break;
            }
        }
        if(!found){
            // si llegó aquí es porque el estado adyacente va hasta el final de la cola
            this.priorityQueue.push({state: state, cost: Gn});
        }
    }

    removeFromPriorityQueue(state){
        for(let i = 0; i < this.priorityQueue.length; i++){
            if(this.priorityQueue[i].state.row === state.row && this.priorityQueue[i].state.column === state.column){
                // encontramos el nodo que queremos eliminar, lo eliminamos
                this.priorityQueue.splice(i, 1);
                break;
            }
        }
    }

    addToVisited(){
        this.visited.push(this.currentState);
        this.solverUtils.markStateAsVisited(this.currentState);
    }

    wait(time){
        return new Promise(function(res){
            setTimeout(res, time);
        });
    }

    showResult(){
        if(this.finalStateFound){
            alert("Camino al estado final encontrado");
        }else{
            alert("No existe camino al estado final");
        }
    }

    drawGraph(){
        const container = document.getElementById("labyrinthGraph");
        this.solverUtils.drawGraph(container, this.routeToFinal);
    }

    stop(){
        this.clearVars();
    }
}

export default UniformCost;
