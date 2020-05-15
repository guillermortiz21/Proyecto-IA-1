import GraphVisualizer from './GraphVisualizer.js';

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

    removeState(key){
        // hay que quitar tanto el state como el vértice del padre a este estado
        const labState = this.labStates.get(key);
        const parent = labState.getParent();
        for(let i=0; i < parent.adjacents.length; i++){
            if(parent.adjacents[i].row === key.row && parent.adjacents[i].column === key.column){
                // removemos el vértice del padre al hijo que se está removiendo
                parent.adjacents.splice(i, 1);
                break;
            }
        }
        // quitamos el state del map
        this.labStates.delete(key);
    }

    addToVisitOrder(state){
        this.visitOrder.push(state);
    }

    addVisitNumber(state, visitNumber){
        this.labStates.get(state).addVisitNumber(visitNumber);
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

    getState(state){
        return this.labStates.get(state);
    } 

    addVertex(stateA, stateB){
        // agregar stateB a los adjacents de stateA
        const labState = this.getState(stateA);
        labState.adjacents.push(stateB);
    }

    getGn(state){
        var Gn = null;
        for(let [key, value] of this.labStates){
            if(state.row === key.row && state.column === key.column){
                //console.log(value);
                //console.log(value.Gn);
                Gn = value.Gn;
                break;
            }
        }
        //console.log("returning from getGn: ", Gn);
        return Gn;
    }

    getParent(state){
        console.log(this.labStates);
        var parent = null;
        for(let [key, value] of this.labStates){
            if(state.row === key.row && state.column && key.row){
                parent = value.parent;
                break;
            }
        }
        return parent;
    }

    getParentGn(state){
        const parent = this.getParent(state);
        //console.log(parent);
        if(!parent){
            //console.log("returning null");
            return null;
        }
        //console.log("not returning null");
        //console.log("returning: ", this.getGn(parent));
        const parentGn = this.getGn(parent);
        //console.log("returning: " + parentGn);
        return parentGn
    }

    clearVars(){
        this.labStates = new Map();
        this.visitOrder = [];
    }

    drawGraph(container, routeToFinal){
        const graphVisualizer = new GraphVisualizer();
        graphVisualizer.drawGraph(this.labStates, container, routeToFinal);
    }
}

export default LabGraph;