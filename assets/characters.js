import Labyrinth from './Labyrinth.js'
import charactersOptions from './charactersOptions.js'

class Characters{
    constructor(){
        this.terrainsIds = Labyrinth.getTerrainsIds(); //Obtiene los id's de los terrenos
        this.terrainsValues = Labyrinth.getTerrrainValues();//Obtiene diccionario de 
        this.characterFormModal = document.getElementById("characterForm"); //Elemento html del modal de terrenos
        this.characterFormTable = document.getElementById("charactersFormTable").getElementsByTagName("tbody")[0]; //cuerpo de da tabla donde se seleccionan los terrenos
        this.characterFormButton = document.getElementById("submitCharactersFormButton"); // botón para procesas los datos ingresados de terrenos.
        this.charactersValues = []; // arreglo que guarda diccionarios con id de terreno, y el nombre y color seleccionados para ese id
        this.setListenters(); // para escuchar el click del botón
    }

    getCharactersValues(){
        return this.charactersValues;
    }

    setListenters(){
        // escuchar el click del botón para procesar los datos ingresados.
        this.characterFormButton.onclick = this.characterButtonClick.bind(this);
    }

    drawCharactersForm(){
        this.characterFormModal.style.display = "block";
        var tableData = ""
        this.characterFormTable.innerHTML = '<tr><th>Terrenos</th><th>Configuraciones</th></tr>' // limpiar formulario.
        this.characterFormTable.innerHTML = '<tr class="gatito"></tr>'

        for(let i=0; i < this.terrainsIds.length; i++){
            let terrainsName = this.terrainsValues[i].name;
            //let terrainsColor = this.terrainsValues[i].color;
            tableData =  "";
            tableData += '<tr terr="'+ terrainsName +'">';
            tableData += '<td terr="leftCell' + terrainsName + '">' + terrainsName+ '</td>';

            tableData += '<td class="colorsList"><div class="radioContainer">';
            for(let j=0; j<this.terrainsValues.length; j++){
               // tableData += '<div class="radioContainer"><input type="radio" id="terr" name="terr" value "N/A">';
                tableData += '<div><input type="text" id="peso" name="peso" placeholder="peso"></div>';
            }
        }
        tableData += '</div></td>';
        tableData += '</tr>'
        this.characterFormTable.innerHTML += tableData;
    }

    characterButtonClick(event){
        this.charactersValues = [];
       //Aquí tiene qué iterarse dependiendo de cuántos personajes se hayan elegido
       //Ya que estos son los que van a ingresar al diccionario con sus datos.
    }
}

export default Characters;