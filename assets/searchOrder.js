import Labyrinth from './labyrinth.js';

class SearchOrder{
    constructor(){}

    setVariables(){
        this.searchOrderForm = document.getElementById("searchOrderForm"); // form para escoger el orden de búsqueda
        this.submitSearchOrderFormButton = document.getElementById("submitSearchOrderFormButton"); // botón para guardar el orden de búsqueda
        this.searchOrderTable = document.getElementById("searchOrderTable");
        this.searchOrder = [];
        this.setListenters(); // para escuchar el click del botón
    }

    setListenters(){
        // escuchar el click del botón para procesar los datos ingresados.
        this.submitSearchOrderFormButton.onclick = this.searchOrderButtonClick.bind(this);
    }

    searchOrderButtonClick(){
        this.searchOrder = [];
        if(this.validateOrderConfig()){
            this.parseTable();
            Labyrinth.setSearchOrder(this.searchOrder);
            this.hideOrderForm();
        }else{
            alert("La selección de orden de búsqueda no es válida.");
        }
    }

    parseTable(){
        this.searchOrder = [];
        const directionOptions = 4;
        for(let i = 0; i < directionOptions; i++){
            const select = document.getElementById('searchOption' + i);
            this.searchOrder.push(select.value);
        }
    }

    validateOrderConfig(){
        var valid = true;
        this.searchOptionsSelected = []
        const directionOptions = 4;
        for(let i = 0; i < directionOptions; i++){
            const selectValue = document.getElementById('searchOption' + i).value;
            if(!this.searchOptionsSelected.includes(selectValue)){
                this.searchOptionsSelected.push(selectValue);
            }else{
                valid = false;
                break;
            }
        }
        if(this.searchOptionsSelected.length != directionOptions){
            valid = false;
        }
        return valid;
    }

    drawOrderForm(){
        this.setVariables();
        this.searchOrderForm.style.display = "block";
        const directionOptions = 4;
        // creamos tabla
        var tableData = "";
        tableData += '<tr><th>1</th><th>2</th><th>3</th><th>4</th></tr>';
        tableData += '<tr>';
        for(let i = 0; i < directionOptions; i++){
            tableData += '<td><select id="searchOption' + i + '">';
            tableData += '<option value="up">Arriba</option>'
            tableData += '<option value="right">Derecha</option>'
            tableData += '<option value="down">Abajo</option>'
            tableData += '<option value="left">Izquierda</option>'
            tableData += '</td>';
        }
        tableData += '</tr>';
        this.searchOrderTable.innerHTML = tableData;

        // colocamos los valores ya insertados.
        this.searchOrder = Labyrinth.getSearchOrder();
        for(let i = 0; i < directionOptions; i++){
            const select = document.getElementById('searchOption' + i);
            select.value = this.searchOrder[i];
        }
    }

    hideOrderForm(){
        this.searchOrderForm.style.display = "none";
    }
}

export default SearchOrder;
