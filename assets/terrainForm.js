import terrainOptions from './terrainOptions.js';
import Labyrinth from './Labyrinth.js'


class TerrainForm{
    constructor(){
        this.terrainsIds = Labyrinth.getTerrainsIds(); // ids de los distintos terrenos que llegaron del archivo
        this.terrainFormModal = document.getElementById("terrainForm"); // elemento html del form de terrenos (el modal)
        this.terrainFormTable = document.getElementById("terrainFormTable").getElementsByTagName("tbody")[0]; //cuerpo de da tabla donde se seleccionan los terrenos
        this.terrainsFormButton = document.getElementById("submitTerrainsFormButton"); // botón para procesas los datos ingresados de terrenos.
        this.terrainValues = []; // arreglo que guarda diccionarios con id de terreno, y el nombre y color seleccionados para ese id
        this.setListenters(); // para escuchar el click del botón
    }

    getTerrrainValues(){
        return this.terrainValues; // retorna el diccionario con los datos de los terrenos
    }

    setListenters(){
        // escuchar el click del botón para procesar los datos ingresados.
        this.terrainsFormButton.onclick = this.terrainButtonClick.bind(this);
    }

    drawTerrainsForm(){
        this.terrainFormModal.style.display = "block";
        var tableData = ""
        this.terrainFormTable.innerHTML = '<tr><th>Id</th><th>Terreno</th></tr>' // limpiar formulario.
        
        // va a haber una row por cada uno de los id de terreno
        for(let i=0; i < this.terrainsIds.length; i++){
            let id = this.terrainsIds[i];
            tableData = "";
            tableData += '<tr id="'+ id +'">'; // table row del terrain id
            tableData += '<td id="leftCell' + id + '">' + id + '</td>'; // celda que muestra el id del terreno

            // celda que va a mostrar las distintas opciones de terreno disponibles
            tableData += '<td class="colorsList"><div class="radioContainer">';
            for(let j=0; j < terrainOptions.length; j++){
                // agrego un radio para cada uno de los tipos de terrenos
                tableData += '<div class="radioContainer"><input type="radio" id="terrain' + terrainOptions[j].id + id + '"name="terrain' + id + '" value="' + terrainOptions[j].id + '"></div>'
                tableData += '<label for="terrain' + terrainOptions[j].id + id + '">' + terrainOptions[j].name + '<div class="colorBox ' + terrainOptions[j].id + '" ></div></label>'
            }
            tableData += '</div></td>';
            tableData += '</tr>'
            this.terrainFormTable.innerHTML += tableData;
        }

        for(let j=0; j < terrainOptions.length; j++){
            let elements = document.getElementsByClassName(terrainOptions[j].id);
            for(let i = 0; i < elements.length; i++){
                elements[i].style.backgroundColor = terrainOptions[j].color;
            }
        }

        this.setAlreadySelectedValues();

    }

    setAlreadySelectedValues(){
        const terrainValues = Labyrinth.getTerrrainValues();
        for(let i = 0; i < terrainValues.length; i++){
            document.getElementById("terrain" + terrainValues[i].terrainId + terrainValues[i].id).checked = true;
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
                let terrain = this.findTerrain(selected);
                let values  = {
                    id: id,
                    terrainId: terrain.id,
                    name: terrain.name,
                    color: terrain.color
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

