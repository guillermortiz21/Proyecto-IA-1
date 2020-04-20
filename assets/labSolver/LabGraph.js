import Graph from './Graph.js';

class LabGraph{
    constructor(){
        this.graph = new Graph();
        this.visitOrder = []; // esto va a ser una cola en donde van a ir entrando los estados conforme se vayan visitando
    }

    addState(labState){
        this.graph.addNode(labState.state, labState);
    }

    addVisit(state){
        this.visitOrder.push(state);
    }
}

export default LabGraph;