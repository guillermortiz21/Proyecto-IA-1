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
        console.log(graph);
        console.log(container);
        this.setOptions();
        this.setGraphData(graph);
        console.log(this.data);
        var network = new vis.Network(container, this.data, this.options);
        this.setStyles();
    }

    setGraphData(graph){
        this.nodes = [];
        this.edges = [];
        for(var [key, value] of graph){
            // agregamos la llame a nodes
            var label = value.name
            for(let i = 0; i < value.visitNumbers.length; i++){
                if(label === value.name){
                    label += " -- " + value.visitNumbers[i];
                }else{
                    label += "," + value.visitNumbers[i];
                }
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
            height: '1000px',
            width: '1000px',
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

    setStyles(){
        document.getElementsByClassName("vis-network")[0].style.margin = "10px auto";
    }
}

export default GraphVisualizer;
