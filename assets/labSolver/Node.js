class Node {
    constructor(value){
        this.value = value; // valor que guarde el nodo
        this.adjacents = []; // hijos del nodo
    }

    getValue(){
        return this.state;
    }

    getAdjacents(){
        return this.adjacents;
    }

    setValue(value){
        this.state = state;
    }

    setVisited(visited){
        this.visited = visited;
    }

    setAdjacents(adjacents){
        this.adjacents = adjacents;
    }

    addAdjacent(node){
        this.addAdjacents.push(node);
    }

    removeAdjacent(node){
        const index = this.adjacents.indexOf(node);
        if(index > -1){
            // desde index borra 1
            this.addAdjacent.splice(index, 1);
        }
    }
}

export default Node;