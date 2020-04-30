import Labyrinth from '../labyrinth.js';
import SolverUtils from './SolverUtils.js';

class DepthFirstSearch{
    constructor(){
        this.solverUtils = new SolverUtils();
        this.stack = []; // pila del algoritmo. Va a guardar las coordenadas de los nodos
        this.visited = [];
        this.initialState = {};
        this.currentState = {};
        this.routeToFinal = [];
        this.finalState = {};
        this.finalStateFound = false;
        this.acumulatedCost = 0;
        this.visitNumber = 0;
        this.waitTime = 500; // 1 segundo
    }

    async solve(){
        this.startSolver();

        // iteramos mientras la pila no esté vacía o mientras no lleguemos al estado final
        this.finalStateFound = false;
        while(this.stack.length > 0 && !this.finalStateFound){
            // seleccionamos nuestro nodo actual
            this.selectNode();

            console.log(this.currentState);

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
        this.stack = [];
        this.visited = [];
        this.initialState = {};
        this.currentState = {};
        this.finalStateFound = false;
        this.acumulatedCost = 0;
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

        // iniciamos el costo acumulado en menos el peso del primero, porque
        // al hacer select node por primera vez se va a agregar ese peso,
        // dejándolo en cero.
        //this.acumulatedCost = -1 * this.solverUtils.getStateWeight(this.initialState);
        this.acumulatedCost = 0;

        // colocamos estado inicial en el grafo
        //this.initialState = this.solverUtils.addToGraph(this.initialState, this.acumulatedCost);
        this.solverUtils.addToGraph(this.initialState, null, this.acumulatedCost);

        // poner estado inicial en la pila
        this.stack.unshift(this.initialState);
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
        this.visitNumber++;
        this.solverUtils.addVisitNumber(this.currentState, this.visitNumber);
        this.addToVisited();

        // actualizamos costo acumulado
        const stateWeight = this.solverUtils.getStateWeight(this.currentState);
        if(this.visitNumber === 1){
            this.acumulatedCost = 0; // en el prmer nodo nuestro el costo acumulado es cero
        }else{
            this.acumulatedCost = this.acumulatedCost + stateWeight;
        }
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
        console.log(adjacents);
        // revisar cada uno y determinar si es un hijo válido.
        // Hijo válido es que su peso no sea n/a y que no esté fuera del laberinto
        for(let i = 0; i < adjacents.length; i++){
            if(this.solverUtils.isValidAdjacent(adjacents[i], this.visited)){
                // tabién hay que revisar que el estado no esté ya en el grafo
                if(!this.solverUtils.isInGraphByState(adjacents[i])){
                    // expando solo si es un adjacente válido
                    // agregamos el adjactente al gráfo
                    const stateWeight = this.solverUtils.getStateWeight(adjacents[i]);
                    //adjacents[i] = this.solverUtils.addToGraph(adjacents[i], this.acumulatedCost + stateWeight);
                    this.solverUtils.addToGraph(adjacents[i], this.currentState, this.acumulatedCost + stateWeight);
    
                    // maracamos el adjacente en el grafo
                    this.solverUtils.addVertexToGraph(this.currentState, adjacents[i]);
    
                    // metemos el adjacente a la pila
                    this.stack.unshift(adjacents[i]);
                }
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

export default DepthFirstSearch;
