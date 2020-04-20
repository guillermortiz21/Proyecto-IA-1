class LabState {
    constructor(state, visited, weight, arriveCost){
        this.state = state; // estado del laberinto
        this.visited = visited; // si ya fue visitado ese estado
        this.weight = weight; // costo para cruzar ese estado. (El costo de pasar por esa casilla)
        this.arriveCost = arriveCost; // costo para llegar a ese estado. (El costo acumulado del algoritmo)        
    }

    getState(){
        return this.state;
    }

    getVisited(){
        return this.visited;
    }

    getCost(){
        return this.cost;
    }

    getAdjacents(){
        return this.adjacents;
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

    setArriveCost(arriveCost){
        this.arriveCost = arriveCost;
    }

    setAdjacents(adjacents){
        this.adjacents = adjacents;
    }

    addAdjacents(node){
        this.addAdjacents.push(node);
    }
}

export default LabState;