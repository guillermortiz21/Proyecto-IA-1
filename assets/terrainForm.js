import terrainOptions from './terrainOptions.js';

const colorBox = './assets/colorBox.css';
console.log(colorBox);

class TerrainForm{
    constructor(){
        this.terrainsIds = [];
        this.terrainFormModal = document.getElementById("terrainForm");
        this.terrainFormTable = document.getElementById("terrainFormTable").getElementsByTagName("tbody")[0];
        this.terrainsFormButton = document.getElementById("terrainsFormButton");
        this.terrainsFormButton.onclick = this.terrainButtonClick.bind(this);
        this.terrainValues = [];
    }

    setTerrainsIds(terrainsIds){
        this.terrainsIds = terrainsIds;
    }

    drawTerrainsForm(){
        this.terrainFormModal.style.display = "block";
        var tableData = ""
        for(let i=0; i < this.terrainsIds.length; i++){
            let id = this.terrainsIds[i];
            tableData = "";
            tableData += '<tr id="'+ id +'">';
            tableData += '<td>' + id + '</td>';
            tableData += '<td>';
            tableData += '<select id="select' + id + '">'
            for(let j=0; j < terrainOptions.length; j++){
                tableData += '<option value="' + terrainOptions[j].name + '">' + terrainOptions[j].name  + '</option>';
            }
            tableData += '</select>'
            tableData += '</td>';
            tableData += '</tr>'
            this.terrainFormTable.innerHTML += tableData;
        }
    }

    terrainButtonClick(event){
        this.terrainValues = []
        for(let i=0; i < this.terrainsIds.length; i++){
            let id = this.terrainsIds[i];
            let name = document.getElementById("name" + id).value;
            let color = document.getElementById("color" + id).value;
            let values  = {
                id,
                name,
                color
            }
            this.terrainValues.push(values);
        }
        console.log(this.terrainValues);
    }
}

export default TerrainForm;
