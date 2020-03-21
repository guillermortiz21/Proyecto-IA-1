import FileParser from './fileParser.js';
import TerrainForm from './terrainForm.js';


class Labyrinth{
    constructor(){
        this.labFile = ""; // string que guarda el contenido del archivo en crudo
        this.fileArray = []; // arreglo de arreglos. El primer arreglo contiene cada fila del archivo. Cada fila contiene los ids por separado
        this.terrainsIds = []; // arreglo con cada uno de los ids de terrenos
        this.terrainValues = []; // arreglo que guarda diccionarios. Cada diccionario contiene id de terreno, nombre del terreno y su color.

        this.labyrinthElement = document.getElementById("labyrinth"); // elemento html donde se pinta el laberinto
        this.terrainFormModal = document.getElementById("terrainForm"); // elemento html donde se piden los datos de los terrenos

        // esto es para escuchar eventos de cambios de estilo de formulario de terrenos
        // el evento se dispara cuando el formulario cambia su estilo display
        // el display cambia a block cuando aparece el formulario y a none cuando se cierra.
        // cuando se cierra el formulario de terrenos quiere decir que los datos de terreno se ingresaron
        // por lo que hay que dibujar el laberinto con esos nuevos datos.
        this.terrainsFormObserver = new MutationObserver(this.terrainFormObserverCallback.bind(this));
        
    }

    setLabFile(labFile){
        this.labFile = labFile;
    }

    getLabFile(){
        return this.labFile;
    }

    getTerrainsIds(){
        return this.terrainsIds;
    }

    parseFile(){
        this.fileParser = new FileParser();
        if(this.fileParser.parseAndValidateFile()){
            // de file parser obtenemos fileArray y terrainsIds
            this.fileArray = this.fileParser.getFileArray();
            this.terrainsIds = this.fileParser.getTerrainsIds();
            this.setObservers();
            this.drawTerrainsForm()
        }else{
            alert(this.fileParser.getError());

        }
    }

    drawTerrainsForm(){
        this.terrainForm = new TerrainForm();
        //this.terrainForm.setTerrainsIds(terrainsIds);
        this.terrainForm.drawTerrainsForm();
    }

    setObservers(){
        // observar cambios de estilo del formulario de terrenos
        this.terrainsFormObserver.observe(this.terrainFormModal, {attributes:true, attributeFilter:['style']});
    }

    terrainFormObserverCallback(changes){
        if(changes[0].target.style.cssText === "display: none;"){
            // en el formulario de terrenos se setearon ya los valores de cada terreno
            // hay que recuperar dichos valores
            this.terrainValues = this.terrainForm.getTerrrainValues();

            // tenemos los datos de los terrenos. Ya podemos dibujar el laberinto!
            this.drawLabyrinth();
        }
    }

    drawLabyrinth(){
        console.log(this.fileArray);
        console.log(this.terrainValues);
        var labyrinthHtml = "";
        // iterar a traves de toda la matriz dentro de fileArray
        // y crear el html
        for(let i = 0; i < this.fileArray.length; i++){
            for(let j = 0; j < this.fileArray[i].length; j++){
                labyrinthHtml += '<div id="cell' + i + ',' + j + '" class="cell ' + this.fileArray[i][j] + '">' + this.fileArray[i][j] + '</div>';
            }
            labyrinthHtml += "<br>"
        }
        this.labyrinthElement.innerHTML = labyrinthHtml

        // modificar color de las celdas
        for(let i=0; i < this.terrainValues.length; i++){
            let elements = document.getElementsByClassName(this.terrainValues[i].id);
            for(let j = 0; j < elements.length; j++){
                elements[j].style.backgroundColor = this.terrainValues[i].color;
            }
        }
    }
}

const instance = new Labyrinth();

export default instance;