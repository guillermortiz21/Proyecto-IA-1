import Labyrinth from './labyrinth.js'
import charactersOptions from './charactersOptions.js'

class Characters{
    constructor(){
        this.terrainsIds = Labyrinth.getTerrainsIds(); //Obtiene los id's de los terrenos
        this.terrainsValues = Labyrinth.getTerrrainValues();//Obtiene diccionario de terrenos
        this.characterFormModal = document.getElementById("characterForm"); //Elemento html del modal de terrenos
        this.characterFormTable = document.getElementById("charactersFormTable").getElementsByTagName("tbody")[0]; //cuerpo de da tabla donde se seleccionan los terrenos
        this.characterFormButton = document.getElementById("submitCharactersFormButton"); // botón para procesas los datos ingresados de terrenos.
        this.charactersValues = []; // arreglo que guarda diccionarios con id de terreno, y el nombre y color seleccionados para ese id
        this.setListenters(); // para escuchar el click del botón
        this.maxCharacters = 5;
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
        var NA = " N/A ";
        //this.characterFormTable.innerHTML = '<div class="gatito"></div>'
        this.characterFormTable.innerHTML = '<tr><th>Terrenos</th><th>Colores</th><th>Configuraciones</th></tr>' // limpiar formulario.

        for(let i=0; i < this.terrainsValues.length; i++){
            let terrainsName = this.terrainsValues[i].name;
            let terrainsColor = this.terrainsValues[i].color;
            tableData =  "";
            tableData += '<tr terr="'+ terrainsName + terrainsColor + '">';
            //tableData += '<td terr="leftCell' + terrainsName + terrainsColor +'">' + terrainsName+ terrainsColor + '<class="colorBox' + terrainsColor + '"></td>';

            tableData += '<td label for="terr' + terrainsName + '">' + terrainsName + '<td class="colorBox ' + terrainsColor + '"</td></label>'

            tableData += '<td><div class="checkbox">';
            for(let j=0; j<this.maxCharacters; j++){
                tableData += '<class="checkbox"><input type="checkbox" id="terr" name="terr">';
                tableData += '<label for="terr">' + NA + '</label>'; 
                tableData += '<input type="text" id="peso" name="peso" placeholder="Peso" size="10" maxlength="4">';
            }
            tableData += '</td>';
            tableData += '</tr>'
            this.characterFormTable.innerHTML += tableData;
        }
        
        //Para colorear los cuadritos de los terrenos
        for(let j=0; j < this.terrainsValues.length; j++){
            let elements = document.getElementsByClassName(this.terrainsValues[j].color);
            for(let i = 0; i < elements.length; i++){
                elements[i].style.backgroundColor = this.terrainsValues[j].color;
            }
        }
        
    }

    characterButtonClick(event){
        this.charactersValues = [];
       //Aquí tiene qué iterarse dependiendo de cuántos personajes se hayan elegido
       //Ya que estos son los que van a ingresar al diccionario con sus datos.
    }
}

export default Characters;