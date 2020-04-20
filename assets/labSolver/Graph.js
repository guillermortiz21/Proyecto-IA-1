import Node from './Node.js';

class Graph{
    constructor(){
        this.nodes = new Map();
    }

    addNode(key, value){
        if(!this.keyInGraph(key)){
            const node = new Node(value);
            this.nodes.set(key, node);
        }
    }

    keyInGraph(key){
        return this.nodes.has(key);
    }
}

export default Graph;