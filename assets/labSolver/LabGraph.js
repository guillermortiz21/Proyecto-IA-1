class LabGraph{
    constructor(){
        this.labStates = new Map();
        this.visitOrder = []; // esto va a ser una cola en donde van a ir entrando los estados conforme se vayan visitando
    }

    getLabStates(){
        return this.labStates;
    }

    addState(key, labState){
        if(!this.keyInGraph(key)){
            this.labStates.set(key, labState);
        }
    }

    addToVisitOrder(state){
        this.visitOrder.push(state);
    }

    keyInGraph(key){
        return this.labStates.has(key);
    }

    stateInGraph(state){
        var stateInGraph = false;
        // iterar a través de todos mis labStates y encontrar si el state ya está en el grafo
        //console.log(this.labStates.entries());
        for(var [key, value] of this.labStates){
            //console.log(`${key.row} === ${state.row} && ${key.column} === ${state.column}`);
            if(key.row === state.row && key.column === state.column){
                stateInGraph = true;
                break;
            }
        }
        return stateInGraph;
    }

    setStateAsVisited(state){
        this.labStates.get(state).visited = true;
    }

    getVisitOrder(){
        return this.visitOrder;
    }

    getState(stateA){
        return this.labStates.get(stateA);
    } 

    addVertex(stateA, stateB){
        // agregar stateB a los adjacents de stateA
        const labState = this.getState(stateA);
        labState.adjacents.push(stateB);
    }

    getGn(state){
        return this.labStates.get(state).Gn;
    }

    clearVars(){
        this.labStates = new Map();
        this.visitOrder = [];
    }
}

export default LabGraph;