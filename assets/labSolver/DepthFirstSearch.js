import Labyrinth from '../labyrinth.js';
import SolverUtils from './SolverUtils.js';
import LabGraph from './LabGraph.js';

class DepthFirstSearch{
    constructor(){
        this.labGraph = new LabGraph(); 
        this.solverUtils = new SolverUtils();
        this.stack = []; // pila del algoritmo. Va a guardar las coordenadas de los nodos
        this.visited = [];
        this.initialState = {};
        this.currentState = {};
        this.finalStateFound = false;
        this.arriveCost = 0;
        this.waitTime = 1000; // 1 segundo
    }

    async solve(){
        this.startSolver();

        // iteramos mientras la pila no esté vacía o mientras no lleguemos al estado final
        this.finalStateFound = false;
        while(this.stack.length > 0 && !this.finalStateFound){
            // seleccionamos nuestro nodo actual
            this.selectNode();

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

        this.showResult();
        
    }

    clearVars(){
        this.stack = [];
        this.visited = [];
        this.initialState = {};
        this.currentState = {};
        this.finalStateFound = false;
        this.arriveCost = 0;
    }

    startSolver(){
        this.clearVars();
        // poner estado inicial en la pila
        this.initialState = Labyrinth.getInitialState();
        this.stack.unshift(this.initialState);

        // iniciamos las visitas
        const firstVisit = 1;
        this.solverUtils.setVisit(firstVisit);
        this.solverUtils.setCurrentState(this.initialState);

        // colocamos estado inicial en el grafo
        this.arriveCost = 0; // no nos ha costado nada llegar hasta este nodo.
        this.solverUtils.addToGraph(this.labGraph, this.initialState, this.arriveCost);
    }

    selectNode(){
        // en primero en anchura se selecciona el primero de la pila
        // colocamos al primero de la pila como el estado actual, y lo desapilamos
        // tenemos que revisar si es un nodo válido.
        this.currentState = this.stack.shift();
        while(!this.solverUtils.isValidAdjacent(this.currentState, this.visited)){
            this.currentState = this.stack.shift();
        }
        this.solverUtils.changeState(this.currentState);
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
        // revisar cada uno y determinar si es un hijo válido.
        // Hijo válido es que su peso no sea n/a y que no esté fuera del laberinto
        for(let i = 0; i < adjacents.length; i++){
            if(this.solverUtils.isValidAdjacent(adjacents[i], this.visited)){
                // expando solo si es un adjacente válido
                // metemos current state a la pila
                this.stack.unshift(adjacents[i]);
            }
        }
    }

    addToVisited(){
        this.visited.push(this.currentState);
    }

    wait(time){
        return new Promise(function(res){
            setTimeout(res, time);
        });
    }

    showResult(){
        if(this.finalStateFound){
            console.log("Camino al estado final encontrado");
        }else{
            console.log("No existe camino al estado final");
        }
    }

    stop(){
        this.clearVars();
    }
}

export default DepthFirstSearch;
