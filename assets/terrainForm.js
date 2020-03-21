import terrainOptions from './terrainOptions.js';
import Labyrinth from './Labyrinth.js'


class TerrainForm{
    constructor(){
        this.terrainsIds = Labyrinth.getTerrainsIds();
        this.terrainFormModal = document.getElementById("terrainForm");
        this.terrainFormTable = document.getElementById("terrainFormTable").getElementsByTagName("tbody")[0];
        this.terrainsFormButton = document.getElementById("terrainsFormButton");
        this.terrainFormChangeWatcher = document.getElementById("terrainFormChangeWatcher");
        this.terrainValues = [];
        this.setListenters();
    }

    getTerrrainValues(){
        return this.terrainValues;
    }

    setListenters(){
        this.terrainsFormButton.onclick = this.terrainButtonClick.bind(this);
    }

    drawTerrainsForm(){
        this.terrainFormModal.style.display = "block";
        var tableData = ""
        for(let i=0; i < this.terrainsIds.length; i++){
            let id = this.terrainsIds[i];
            tableData = "";
            tableData += '<tr id="'+ id +'">';
            tableData += '<td>' + id + '</td>';
            tableData += '<td class="colorsList">';
            for(let j=0; j < terrainOptions.length; j++){
                tableData += '<input type="radio" id="terrain' + terrainOptions[j].id + id + '"name="terrain' + id + '" value="' + terrainOptions[j].id + '">'
                tableData += '<label for="terrain' + terrainOptions[j].id + id + '">' + terrainOptions[j].name + '<div class="colorBox ' + terrainOptions[j].id + '" ></div></label>'
            }
            tableData += '</td>';
            tableData += '</tr>'
            this.terrainFormTable.innerHTML += tableData;
        }

        for(let j=0; j < terrainOptions.length; j++){
            let elements = document.getElementsByClassName(terrainOptions[j].id);
            for(let i = 0; i < elements.length; i++){
                elements[i].style.backgroundColor = terrainOptions[j].color;
            }
        }

    }

    terrainButtonClick(event){
        this.terrainValues = []
        var valid = true;
        var error = "Se encontraron los siguientes errores:\n";
        for(let i=0; i < this.terrainsIds.length; i++){
            let id = this.terrainsIds[i];
            let selected = document.querySelector('input[name="terrain' + id + '"]:checked');
            if(selected){
                selected = selected.value;
                let {name, color} = this.findTerrain(selected);
                let values  = {
                    id,
                    name,
                    color
                }
                this.terrainValues.push(values);
            }else{
                error += `No has elegido ningún terreo para el id ${id}\n`;
                valid = false;
            }
            
        }
        if(!valid){
            alert(error);
            return;
        }
        let validTerrain = this.validateTerrainSelection();
        if(validTerrain.valid){
            // todo correcto
            // cerrar ventana
            // esto triggerea el watcher del form y hace que se dibuje
            // el laberinto
            this.terrainFormModal.style.display = "none";
            localStorage.setItem("terrainValues", this.terrainValues);
        }else{
            alert(validTerrain.error);
            return;
        }
    }

    // encontrar el terreno que se seleccionó dentro de terrain options
    findTerrain(id){
        var terrain = {}
        for(let i = 0; i < terrainOptions.length; i++){
            if(terrainOptions[i].id === id){
                terrain = terrainOptions[i];
                break;
            }
        }
        return terrain;
    }

    validateTerrainSelection(){
        var selectedTerrains = []
        var valid = true;
        var error = "Se encontraron los siguientes errores:\n";
        for(let i = 0; i < this.terrainValues.length; i++){
            if(selectedTerrains.indexOf(this.terrainValues[i].name) !== -1){
                // si es distinto a -1 es porque el terreno ya se había elegido antes
                error += `El terreno del id ${this.terrainValues[i].id} ya había sido seleccionado.\n`;
                valid = false;
            }
            selectedTerrains.push(this.terrainValues[i].name);
        }
        //console.log(selectedTerrains);
        return {valid, error};
    }

}

export default TerrainForm;

