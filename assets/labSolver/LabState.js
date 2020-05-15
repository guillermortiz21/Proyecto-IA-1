class LabState {
    constructor(state, parent, visited, weight, Gn, Hn, name){
        this.parent = parent;
        this.state = state; // estado del laberinto
        this.visited = visited; // si ya fue visitado ese estado
        this.weight = weight; // costo para cruzar ese estado. (El costo de pasar por esa casilla)
        this.Gn = Gn; // coste del inicial a este nodo
        this.Hn = Hn; // coste de este nodo al final
        this.name = name;
        this.visitNumbers = [];
        this.adjacents = []; // vecinos del estado
    }

    getState(){
        return this.state;
    }

    getVisited(){
        return this.visited;
    }

    getWeight(){
        return this.weight;
    }

    getParent(){
        return this.parent;
    }

    getGn(){
        return this.Gn;
    }

    getHn(){
        return this.Hn;
    }

    getAdjacents(){
        return this.adjacents;
    }

    getName(){
        return this.name;
    }

    getVisitNumbers(){
        return this.visitNumbers;
    }

    setState(state){
        this.state = state;
    }

    setVisited(visited){
        this.visited = visited;
    }

    setWeight(weight){
        this.weight = weight;
    }

    setName(name){
        this.name = name;
    }

    setVisitNumbers(visitNumbers){
        this.visitNumbers = visitNumbers;
    }

    setGn(Gn){
        this.Gn = Gn;
    }

    setHn(Hn){
        this.Hn = Hn;
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

    addVisitNumber(number){
        this.visitNumbers.push(number);
    }
}

export default LabState;