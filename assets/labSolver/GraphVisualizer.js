import Labyrinth from '../labyrinth.js';

class GraphVisualizer{
    constructor(){
        this.nodes = [];
        this.edges = [];
        this.options = {};
        this.data = {};
        this.routeToFinal = [];
    }

    drawGraph(graph, container, routeToFinal){
        this.routeToFinal = routeToFinal;
        this.setOptions();
        this.setGraphData(graph);
        var network = new vis.Network(container, this.data, this.options);
        this.setStyles();
    }

    setGraphData(graph){
        this.nodes = [];
        this.edges = [];
        for(var [key, value] of graph){
            // agregamos la llame a nodes
            // la label es lo que va a aparecer en cada nodo del arbol
            var label = value.name
            for(let i = 0; i < value.visitNumbers.length; i++){
                if(label === value.name){
                    label += " -- " + value.visitNumbers[i];
                }else{
                    label += "," + value.visitNumbers[i];
                }
            }
            const solverType = Labyrinth.getSolverType();
            if(solverType == "UniformCost"){
                label += "\nGn: " + parseFloat(value.Gn).toFixed(2);
            }
            const node = {
                id: key.row + ',' + key.column,
                label: label
            };
            if(this.routeToFinal.includes(key)){
                node.color = {
                    border: '#82A511',
                    background: '#82A511'
                }
            }else{
                node.color = {
                    border: '#A0B5CA',
                    background: '#A0B5CA'
                }
            }
            this.nodes.push(node);
            // y hay que agregar cada uno de los hijos
            for(let i = 0; i < value.adjacents.length; i++){
                const edge = {
                    from: key.row + ',' + key.column,
                    to: value.adjacents[i].row + ',' + value.adjacents[i].column
                };
                this.edges.push(edge);
            }

        }
        // seteamos el data del grafo
        this.data = {
            nodes: this.nodes,
            edges: this.edges
        };
    }

    setOptions(){
        this.options = {
            edges:{
                color: "#3379BC"
            },
            autoResize: true,
            height: '900px',
            width: '800px',
            locale: 'en',
            layout: {
                hierarchical: {
                    enabled: true,
                    sortMethod: "directed",
                    shakeTowards: "roots",
                    parentCentralization: true
                }
            }
        }
    }
    /*
        hierarchical: {
            enabled: true, le dice al grafo que va a tener una jerarquía (se muestra como arbol)
            sortMethod: "directed", (Para asegurara los niveles)
            shakeTowards: "roots", (que las hojas estén lo más cerca posible a su padre)
            parentCentralization: true
        }
    */

    setStyles(){
        document.getElementsByClassName("vis-network")[0].style.margin = "10px auto";
    }
}

export default GraphVisualizer;
