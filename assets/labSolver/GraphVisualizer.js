class GraphVisualizer{
    constructor(){
        this.nodes = [];
        this.edges = [];
        this.options = {};
        this.data = {};
    }

    drawGraph(graph, container){
        console.log(graph);
        console.log(container);
        this.setGraphData(graph);
        this.setOptions();
        var network = new vis.Network(container, this.data, this.options);
    }

    setGraphData(graph){
        this.nodes = [];
        this.edges = [];
        for(var [key, value] of graph){
            // agregamos la llame a nodes
            const node = {
                id: key.row + ',' + key.column + ',' + key.id,
                label: value.state.row + ', ' + value.state.column
            };
            this.nodes.push(node);
            // y hay que agregar cada uno de los hijos
            for(let i = 0; i < value.adjacents.length; i++){
                const edge = {
                    from: key.row + ',' + key.column + ',' + key.id,
                    to: value.adjacents[i].row + ',' + value.adjacents[i].column + ',' +  value.adjacents[i].id
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
            autoResize: true,
            height: '1000px',
            width: '1000px',
            locale: 'en',
            layout: {
                hierarchical: true
            }
        }
    }
}

export default GraphVisualizer;
