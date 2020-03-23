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

        this.charactersNames = document.getElementById("charactersNames");
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

        var tableNames = "";
        this.charactersNames.style.display = "inline-flex";
        tableNames += '<tr><th class="names">Nera</th><th class="names">Ray</th><th class="names">Meeko</th>';
        tableNames += '<th class="names">Lepuchi</th><th class="names">Ares</th></tr>';
        this.charactersNames.innerHTML += tableNames;

        var tableData = ""
        var NA = " N/A ";
        this.characterFormTable.innerHTML = '<tr><th>Terrenos</th><th>Colores</th><th>Configuraciones</th></tr>' // limpiar formulario.

        for(let i=0; i < this.terrainsValues.length; i++){
            let terrainsName = this.terrainsValues[i].name;
            let terrainsColor = this.terrainsValues[i].color;
            tableData =  "";
            tableData += '<tr id="terr'+ terrainsName + terrainsColor + '">';
            //tableData += '<td terr="leftCell' + terrainsName + terrainsColor +'">' + terrainsName+ terrainsColor + '<class="colorBox' + terrainsColor + '"></td>';

            tableData += '<td>' + terrainsName + '</td>'
            tableData += '<td class="colorBox ' + terrainsColor + '"></td>'

            tableData += '<td>'
                tableData += '<div id="config' + terrainsName + '" class="checkboxRow">';
                    for(let j=0; j<this.maxCharacters; j++){
                        tableData += '<div class="checkboxRowElement">'
                        tableData += '<input type="checkbox" style="width:10px" id="checkbox' + terrainsName + ',' + j + '">';//Mostrar el checkbox
                        tableData += '<label for="checkbox' + terrainsName + ',' + j + '">' + NA + '</label>'; // label del checkbox (N/A)
                        tableData += '<input type="number" id="weight' + terrainsName + ',' + j + '"placeholder="Peso" min="0">';
                        tableData += '</div>'
                    }
                tableData += '</div>'
            tableData += '</td>';
            tableData += '</tr>'
            this.characterFormTable.innerHTML += tableData;
        }

        // agregar table row para la elección del gato
        tableData = "";
        tableData += '<tr>';
        // poner dos tables data para terreno y colores. Están vaciós porque no muestran nada
        tableData += '<td></td><td></td>'
        // agregar un radiobox group para seleccionar el personaje
        tableData += '<td><div class="radioboxRow">'
        for(let j=0; j < this.maxCharacters; j++){
            tableData += '<div class="radioboxRowElement">';
                tableData += '<input type="radio" id="radioCharacter' + j + '" name="radioCharacterSelection" value="character' + j + '">';
                tableData += '<label for"radioCharacter' + j + '">Elegir</label>'
            tableData += '</div>';
        }
        tableData += '</div></td>';
        tableData += '</tr>';
        this.characterFormTable.innerHTML += tableData;
        
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