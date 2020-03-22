import FileParser from './fileParser.js';
import TerrainForm from './terrainForm.js';

class Labyrinth{
    constructor(){
        this.labFile = ""; // string que guarda el contenido del archivo en crudo
        this.fileArray = []; // arreglo de arreglos. El primer arreglo contiene cada fila del archivo. Cada fila contiene los ids por separado
        this.terrainsIds = []; // arreglo con cada uno de los ids de terrenos
        this.terrainValues = []; // arreglo que guarda diccionarios. Cada diccionario contiene id de terreno, nombre del terreno y su color.
        this.initialState = {};
        this.finalState = {};

        this.labyrinthElement = document.getElementById("labyrinth"); // elemento html donde se pinta el laberinto
        this.terrainFormModal = document.getElementById("terrainForm"); // elemento html donde se piden los datos de los terrenos
        this.terrainsFormButton = document.getElementById("terrainsFormButton"); // botón para modificar los datos de los terrenos
        this.changeFileButton = document.getElementById("changeFileButton"); // botón para volver a cargar ell archivo

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

    getTerrrainValues(){
        return this.terrainValues;
    }

    parseFile(){
        this.fileParser = new FileParser();
        if(this.fileParser.parseAndValidateFile()){
            // de file parser obtenemos fileArray y terrainsIds
            this.fileArray = this.fileParser.getFileArray();
            this.terrainsIds = this.fileParser.getTerrainsIds();
            this.setObservers();
            this.setListeners();
            this.drawTerrainsForm();
        }else{
            alert(this.fileParser.getError());
            window.location.href = '../index.html'
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

    setListeners(){
        this.terrainsFormButton.onclick = function(){
            this.drawTerrainsForm();
        }.bind(this)

        this.changeFileButton.onclick = function(){
            window.location.href = '../index.html'
        }
    }

    terrainFormObserverCallback(changes){
        if(changes[0].target.style.cssText === "display: none;"){
            // en el formulario de terrenos se setearon ya los valores de cada terreno
            // hay que recuperar dichos valores
            this.terrainValues = this.terrainForm.getTerrrainValues();

            // nuevo laberinto, borramos la información de estados inicial y final
            this.clearstatesVars();

            // tenemos los datos de los terrenos. Ya podemos dibujar el laberinto!
            this.drawLabyrinth();
        }
    }

    drawLabyrinth(){
        var labyrinthHtml = "";
        // iterar a traves de toda la matriz dentro de fileArray
        // y crear el html

        // imprimir bloque vacío de esquina superior izquierda
        labyrinthHtml += '<div id="headerStart" class="header">&nbsp</div>';

        // imprimir letras de la A a la arrayLenth
        for(let l = 65, i = 0; i < this.fileArray[0].length; l++, i++){
            labyrinthHtml += '<div id="header' + String.fromCharCode(l) + '" class="header">' + String.fromCharCode(l) + '</div>';
        }
        labyrinthHtml += "<br>"
        for(let i = 0; i < this.fileArray.length; i++){
            // mostrar número de fila
            labyrinthHtml += '<div id="leftCell' + parseInt(i+1) + '" class="leftCell">' + parseInt(i+1) + '</div>';
            for(let j = 0; j < this.fileArray[i].length; j++){
                // iniciar celda con su id y su clase celda
                labyrinthHtml += '<div id="cell' + i + ',' + j + '" class="cell ' + this.fileArray[i][j] + ' popup hover">'
                
                // div para mostrar si es inicial (por defecto hay display none)
                labyrinthHtml += '<div class="initial">I</div>'
                
                // div para mostrar si es final (por defecto hay display none)
                labyrinthHtml += '<div class="final">F</div>'
                
                // div para el número de visitas
                labyrinthHtml += '<div class="visit">0</div>'

                // poner aqui el popup para seleccionar si esta casilla es estado incial o final
                labyrinthHtml += '<span class="popuptext" id="popup' + i + "," + j + '">'
                
                // ponder botones para setear inicial y final
                labyrinthHtml += '<button id="popupButtonInitial' + i + "," + j + '" class="popupButton">Seleccionar inicial</button>';
                labyrinthHtml += '<button id="popupButtonFinal' + i + "," + j + '" class="popupButton">Seleccionar final</button>';

                // cerrar popup
                labyrinthHtml += '</span>'

                // crear popup del hover
                labyrinthHtml += '<span class="hoverText" id="hover' + i + "," + j + '">'

                // cerrar popup del hover
                labyrinthHtml += '</span>'

                // cerrar elemento
                labyrinthHtml += '</div>';
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

        // agregar a cada celda un evento de click para seleccionarla como inicial o final
        this.addCellsOnClickEvents();
        this.addHovers();
    }

    addCellsOnClickEvents(){
        // agregar un evento on click a cada una de las celdas del laberinto
        // esto es para mostrar un submenu para seleccionar la celda como
        // inicial o final
        for(let i=0; i < this.fileArray.length; i++){
            for(let j=0; j < this.fileArray[i].length; j++){

                // setear los botones los popups para seleccionar estado inicial y final

                let initailStateButton = document.getElementById("popupButtonInitial" + i + "," + j);
                initailStateButton.onclick = function(){
                    this.setInitialState(i,j);
                }.bind(this);

                let finalStateButton = document.getElementById("popupButtonFinal" + i + "," + j);
                finalStateButton.onclick = function(){
                    this.setFinallState(i,j);
                }.bind(this);

                // setear el onclick de cada una de las celdas

                let cell = document.getElementById("cell" + i + "," + j);
                cell.onclick = function(event){
                    let popup = document.getElementById("popup" + i + "," + j);
                    popup.classList.toggle("show");
                    let hover = document.getElementById("hover" + i + "," + j);
                    hover.classList.toggle("hide");
                }
            }
        }
    }

    setInitialState(i,j){
        // borramos del laberinto el inicial anterior
        if(Object.keys(this.initialState).length !== 0){ // revisamos que haya un inicial anterior
            // ya se había seleccionado un inicial, hay que quitarlo
            // buscamos en los hijos de la celda i,j el div con class initial
            const cell = document.getElementById("cell" + this.initialState.row + ',' + this.initialState.column);
            const initialDiv = cell.getElementsByClassName("initial");
            initialDiv[0].style.display = "none";
        }
        // dibujamos el nuevo inicial
        const cell = document.getElementById("cell" + i + ',' + j);
        const initialDiv = cell.getElementsByClassName("initial");
        initialDiv[0].style.display = "block";

        this.initialState = {
            row: i,
            column: j
        }
    }

    setFinallState(i,j){
        // borramos del laberinto el final anterior
        if(Object.keys(this.finalState).length !== 0){ // revisamos que haya un inicial anterior
            // ya se había seleccionado un inicial, hay que quitarlo
            // buscamos en los hijos de la celda i,j el div con class initial
            const cell = document.getElementById("cell" + this.finalState.row + ',' + this.finalState.column);
            const finalDiv = cell.getElementsByClassName("final");
            finalDiv[0].style.display = "none";
        }
        // dibujamos el nuevo final
        const cell = document.getElementById("cell" + i + ',' + j);
        const finalDiv = cell.getElementsByClassName("final");
        finalDiv[0].style.display = "block";
        this.finalState = {
            row: i,
            column: j
        }
    }

    addHovers(){
        // iterar a través de todo el laberinto
        for(let i=0; i < this.fileArray.length; i++){
            for(let j=0; j < this.fileArray[i].length; j++){
                
                const element = document.getElementById("cell" + i + "," + j);
                const originalColor = element.style.backgroundColor;

                var myTimeout = null;
                element.onmouseover = function(){
                    // cambiar el color en el hover
                    element.style.backgroundColor = "#F7D8AA"
                    myTimeout = setTimeout(function(){
                        // después de 1 segundo de hover, mostrar
                        // los detalles de la celda
                        let hover = document.getElementById("hover" + i + "," + j);
                        let hoverText = this.getCellDetails(i,j);
                        hover.innerHTML = hoverText;
                        hover.style.visibility = "visible";
                    }.bind(this),500);
                }.bind(this);

                element.onmouseout = function(){
                    // regresar al color original
                    element.style.backgroundColor = originalColor;
                    let hover = document.getElementById("hover" + i + "," + j);
                    hover.style.visibility = "hidden";
                    // matar el setTimeout para que no se muestren los
                    // detalles de la celda.
                    clearTimeout(myTimeout);
                }   
            }
        }
    }

    getCellDetails(i,j){
        // si es inicial
        // si es final
        // terreno nombre
        // número de visitas
        const cell = document.getElementById("cell" + i + ',' + j);
        var initialStr = "";
        var finalStr = "";
        var terrainStr = "";
        var visitsStr = "";
        // determinar si es inicial
        if(Object.keys(this.initialState).length !== 0){ 
            if(this.initialState.row === i && this.initialState.column === j){
                initialStr = "Estado inicial: Sí";
            }else{
                initialStr = "Estado final: No";
            }
        }else{
            // no hay nada en la variable de estado inicial
            initialStr = "Estado inicial: No";
        }

        // determinar si es final
        if(Object.keys(this.finalState).length !== 0){ 
            if(this.finalState.row === i && this.finalState.column === j){
                finalStr = "Estado final: Sí";
            }else{
                finalStr = "Estado final: No";
            }
        }else{
            // no hay nada en la variable de estado final
            finalStr = "Estado final: No";
        }

        const terrainId = this.fileArray[i][j];
        const terrain = this.findTerrain(terrainId);
        terrainStr = `Terreno: ${terrain.name}`;

        const visit = cell.getElementsByClassName("visit")[0].innerHTML;
        visitsStr = `Visitas: ${visit}`;
        const message = `${initialStr}<br>${finalStr}<br>${terrainStr}<br>${visitsStr}`;
        return message;
    }

    findTerrain(id){
        var terrain = {}
        for(let i = 0; i < this.terrainValues.length; i++){
            if(this.terrainValues[i].id == id){
                terrain = this.terrainValues[i];
                break;
            }
        }
        return terrain;
    }

    clearstatesVars(){
        this.initialState = {};
        this.finalState = {};
    }
}

const instance = new Labyrinth();

export default instance;