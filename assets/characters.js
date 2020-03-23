import Labyrinth from './labyrinth.js'
import charactersOptions from './charactersOptions.js'

class Characters{
    constructor(){
        this.painted = false;
    }

    setVariables(){
        this.terrainsIds = Labyrinth.getTerrainsIds(); //Obtiene los id's de los terrenos
        this.terrainsValues = Labyrinth.getTerrrainValues();//Obtiene diccionario de terrenos
        this.characterFormModal = document.getElementById("characterForm"); //Elemento html del modal de terrenos
        this.characterFormTable = document.getElementById("charactersFormTable").getElementsByTagName("tbody")[0]; //cuerpo de da tabla donde se seleccionan los terrenos
        this.characterFormButton = document.getElementById("submitCharactersFormButton"); // botón para procesas los datos ingresados de terrenos.
        this.charactersValues = []; // arreglo que guarda diccionarios con id de terreno, y el nombre y color seleccionados para ese id
        this.currentCharacter = {};
        this.maxCharacters = 5;
        this.setListenters(); // para escuchar el click del botón
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
        if(!this.painted){
            var tableNames = "";
            this.charactersNames.style.display = "inline-flex";
            tableNames += '<tr><th class="names">Nera</th><th class="names">Ray</th><th class="names">Meeko</th>';
            tableNames += '<th class="names">Lepuchi</th><th class="names">Ares</th></tr>';
            this.charactersNames.innerHTML += tableNames;
    
            var tableData = ""
            var NA = " N/A ";
            this.characterFormTable.innerHTML = '<tr><th>Terrenos</th><th>Colores</th><th>Configuraciones</th></tr>' // limpiar formulario.

            for(let i=0; i < this.terrainsValues.length; i++){
                let terrainsId = this.terrainsValues[i].id;
                let terrainsName = this.terrainsValues[i].name;
                let terrainsColor = this.terrainsValues[i].color;
                tableData =  "";
                tableData += '<tr id="terr'+ terrainsId + '">';
                //tableData += '<td terr="leftCell' + terrainsName + terrainsColor +'">' + terrainsName+ terrainsColor + '<class="colorBox' + terrainsColor + '"></td>';
    
                tableData += '<td>' + terrainsName + '</td>'
                tableData += '<td class="colorBox ' + terrainsColor + '"></td>'
    
                tableData += '<td>'
                    tableData += '<div id="config' + terrainsName + '" class="checkboxRow">';
                        for(let j=0; j<this.maxCharacters; j++){
                            tableData += '<div class="checkboxRowElement">'
                            tableData += '<input type="checkbox" style="width:10px" id="checkbox' + terrainsId + ',' + j + '">';//Mostrar el checkbox
                            tableData += '<label for="checkbox' + terrainsName + ',' + j + '">' + NA + '</label>'; // label del checkbox (N/A)
                            tableData += '<input type="text" id="weight' + terrainsId + ',' + j + '"placeholder="Peso" min="0">';
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
            this.painted = true;
        }
    }

        
    characterButtonClick(event){
        this.charactersValues = [];
        if(this.validateCharacterConfig()){
            // todo correcto, seteamos los valores de los personajes en Laberynth
            Labyrinth.setCharacters(this.charactersValues);
            Labyrinth.setCurrentCharacter(this.currentCharacter);
            this.hideCharactersForm();
        }
    }

    validateCharacterConfig(){
        // la columna de un ser tiene que estar o toda llena o toda vacía
        // si está toda vacía, es como si el ser no estuviera
        // si está toda vacía 
        // iterar a través de los seres
        // la columna de un ser tiene 
        var error = "Se han encontrado los siguientes errores:\n";
        var allCharactersValid = true;
        for(let i=0; i < this.maxCharacters; i++){
            let configured = false;
            let characterValid = true;
            let terrainWeights = []; 
            let configuredNum = 0;
            for(let j = 0; j < this.terrainsValues.length; j++){
                // aquí accedo a los checkboxes de un personaje
                // tenemos que revisar que este personaje haya sido seleccioado
                // si no tienen ningún combo de NA y ningún valor numérico es porque no fue configurado
                // si tiene al menos un combo de NA o algún valor númerico es porque sí fue configurado
                // si fue configurado, debe tener TODOS sus terrenos configurado (en todos el combo o el valor, más no los dos)
                const id = this.terrainsValues[j].id;
                let value = 0;
                let configValid = true;
                const combo = document.getElementById("checkbox" + id + "," + i);
                const numInput = document.getElementById("weight" + id  + "," + i).value;
                if(combo.checked){
                    configured = true;
                    configuredNum++;
                    // hay checkbox, NO debe haber valor numérico
                    if(numInput != ""){
                        // hay valor numérico, no es válido
                        characterValid = false;
                        configValid = false;
                        error += `Peso con N/A marcado en ${this.terrainsValues[j].name} ${i}\n`;
                    }else{
                        // todo es correcto. El valor del peso es n/a, lo guardamos como -1
                        value = -1;
                    }
                }else if(numInput != ""){
                    // el combo no está seleccionado, vemos si hay numérico")
                    configured = true;
                    configuredNum++;
                    // hay que validar aquí que sea númerico positivo y cortar a dos decimales.
                    if(this.validateNumber(numInput)){
                        value = this.truncateTwoDecimals(numInput);
                    }else{
                        error += `El peso para ${this.terrainsValues[j].name} ${i} no es correcto\n`
                        characterValid = false;
                        configValid = false;
                    }
                }else{
                    // ninguno de los dos tiene un dato.
                    // si el personaje aparece como configurado, debe ser error
                    if(configured){
                        characterValid = false;
                        configValid = false;
                        error += `No hay configuración en ${this.terrainsValues[j].name} ${i}\n`;
                    }
                }
                // si la configuración de este campo en específico es correcta, la agregamos al terrainWeights
                if(configValid){
                    value = {
                        terrainId: id,
                        weight: value
                    }
                    terrainWeights.push(value);
                }
            }
            if(configured && configuredNum !== this.terrainsValues.length){
                characterValid = false;
                error  += `No todos los terrenos están configurados para el ser número ${i}\n`
            }
            if(configured && characterValid){
                const character = {
                    id: i,
                    name: this.getCharacterName(i),
                    weights: terrainWeights
                }
                this.charactersValues.push(character);
            }
            if(configured && !characterValid){
                allCharactersValid = false;
            }
        }

        // revisar que se haya elegido un personaje para jugar
        const selected = document.querySelector('input[name="radioCharacterSelection"]:checked');
        if(selected === null){
            allCharactersValid = false;
            error += "No se seleccionó un personaje para jugar\n";
        }else{
            // tengo que asegurarme que el seleccionado esté en mis character values
            var characterSelectedValid = false;
            const selectedId = selected.id.replace("radioCharacter", "");
            // buscamos selectedId en charactersValues
            for(let i = 0; i < this.charactersValues.length; i++){
                if(this.charactersValues[i].id == selectedId){
                    characterSelectedValid = true;
                    this.currentCharacter = this.charactersValues[i];
                    break;
                }
            }
            if(!characterSelectedValid){
                allCharactersValid = false;
                error += "El ser seleccionado no ha sido configurado para jugar\n";
            }
        }

        if(!allCharactersValid){
            alert(error);
            return;
        }
        return allCharactersValid;
    }

    getCharacterName(i){
        if(i === 0){
            return "Nera";
        }
        if(i === 1){
            return "Ray";
        }
        if(i === 2){
            return "Meeko";
        }
        if(i === 3){
            return "Lepuchi";
        }
        if(i === 4){
            return "Ares";
        }
    }

    validateNumber(number){
        const myRegex = /^\d+\.?\d*$|^\d*\.?\d+$/;
        const regex =  new RegExp(myRegex);
        return regex.test(number);
    }

    truncateTwoDecimals(number){
        number = number.slice(0,(number.indexOf('.') + 3));
        return parseFloat(number);
    }

    hideCharactersForm(){
        this.characterFormModal.style.display = "none";
    }
}

export default Characters;
