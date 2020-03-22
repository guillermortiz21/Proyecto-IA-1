import FileParser from './fileParser.js';
import TerrainForm from './terrainForm.js';
import Characters from './characters';


class Labyrinth{
    constructor(){
        this.labFile = ""; // string que guarda el contenido del archivo en crudo
        this.fileArray = []; // arreglo de arreglos. El primer arreglo contiene cada fila del archivo. Cada fila contiene los ids por separado
        this.terrainsIds = []; // arreglo con cada uno de los ids de terrenos
        this.terrainValues = []; // arreglo que guarda diccionarios. Cada diccionario contiene id de terreno, nombre del terreno y su color.
        this.initialState = {};
        this.finalState = {};
        this.characters = Characters;

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

    getCharacters(){
        return this.characters;
    }

    getInitialState(){
        return this.initialState;
    }

    getFinalState(){
        return this.finalState;
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
            //this.drawCharactersForm();
        }else{
            alert(this.fileParser.getError());
            window.location.href = '../index.html'
        }
    }

    drawCharactersForm(){
        this.characterForm = new Characters();
        this.characterForm.drawCharactersForm();
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
                // iniciar celda con su id y su clase celda, la clase del id del terreno se agrega para dibujar su color.
                // popup es para el click que te da opción para indicar si la celda es inicial o final
                // hover es para el onmouseover que te muestra los datos de la celda
                labyrinthHtml += '<div id="cell' + i + ',' + j + '" class="cell ' + this.fileArray[i][j] + ' popup hover">'
                
                // div para mostrar si es inicial (por defecto hay display none) por lo que la I no se ve
                labyrinthHtml += '<div class="initial">I</div>'
                
                // div para mostrar si es final (por defecto hay display none) por lo que la F no se ve
                labyrinthHtml += '<div class="final">F</div>'
                
                // div para el número de visitas
                labyrinthHtml += '<div class="visit"></div>'
                
                // div para mostrar a nuestro ser en cada una de las seldas
                labyrinthHtml += '<div id="characterContainer' + i + ',' + j + '" class="character">#</div>'

                // poner aqui el popup para seleccionar si esta casilla es estado incial o final
                labyrinthHtml += '<span class="popuptext" id="popup' + i + "," + j + '">'
                
                // ponder botones para setear inicial y final
                labyrinthHtml += '<button id="popupButtonInitial' + i + "," + j + '" class="popupButton">Seleccionar inicial</button>';
                labyrinthHtml += '<button id="popupButtonFinal' + i + "," + j + '" class="popupButton">Seleccionar final</button>';

                // cerrar popup
                labyrinthHtml += '</span>'

                // crear popup del hover
                labyrinthHtml += '<span class="hoverText" id="hover' + i + "," + j + '"></span>'

                // cerrar celda
                labyrinthHtml += '</div>';
            }
            labyrinthHtml += "<br>"
        }
        this.labyrinthElement.innerHTML = labyrinthHtml

        // modificar color de las celdas
        // terrain values es mi diccionario con id - terrenoId - nombre - color
        // con los valores de ese diccionario puedo pintar mi laberinto.
        // itero a través de cada uno de los terrenos.
        for(let i=0; i < this.terrainValues.length; i++){
            // selecciono las celdas que tengan como clase el id de terreno de la iteración actual
            let elements = document.getElementsByClassName(this.terrainValues[i].id);
            // coloreo cada una de esas celdas con su correspondiente color en terrainValues
            for(let j = 0; j < elements.length; j++){
                elements[j].style.backgroundColor = this.terrainValues[i].color;
            }
        }


        // En este punto ya se terminó de dibujar el laberinto.
        // ya podemos agregar el click a cada celda para seleccionar los estados inicial y final
        // y ya podemos agregar el hover en cada celda para mostrar sus datos

        // agregar a cada celda un evento de click para seleccionarla como inicial o final
        this.addCellsOnClickEvents();

        // agregar hovers que nos digan los datos de cada celda.
        this.addHovers();

        // el laberinto ya está en pantalla, ya puedo mover a mi personaje.
        this.labyrinthMovement = new LabyrinthMovement();
        this.labyrinthMovement.startMovement();
    }

    addCellsOnClickEvents(){
        // agregar un evento on click a cada una de las celdas del laberinto
        // esto es para mostrar un submenu para seleccionar la celda como
        // inicial o final
        for(let i=0; i < this.fileArray.length; i++){
            for(let j=0; j < this.fileArray[i].length; j++){

                // tomo cada uno de los botones de inicial y final de cada una de las celdas
                // a cada uno de ellos les pongo su evento de onclick

                let initailStateButton = this.getLabyrinthElement("popupButtonInitial", i, j);
                initailStateButton.onclick = function(){
                    // cuando se haga click en ese botón pongo que la celda con coordenada i,j sea el estado inicial
                    this.setInitialState(i,j);
                }.bind(this);

                let finalStateButton = this.getLabyrinthElement("popupButtonFinal", i, j);
                finalStateButton.onclick = function(){
                    // cuando se haga click en ese botón pongo que la celda con coordenada i,j sea el estado final
                    this.setFinallState(i,j);
                }.bind(this);

                // los botones anteriores aun no se muestran en pantalla, para eso hay 
                // mostrar el popup que los contiene al hacer click en cada una de las celdas

                let cell = this.getLabyrinthElement("cell", i, j);
                // cuando se haga click en la celda con coordenada i,j voy a mostrar el popup de esa celda
                cell.onclick = function(event){
                    // encuntro el popup con coordenadas i,j y lo muestro
                    let popup = this.getLabyrinthElement("popup", i, j);
                    popup.classList.toggle("show");
                }.bind(this);
            }
        }
    }

    // función para hacer que la celda i,j sea el estado inicial
    setInitialState(i,j){
        // borramos del laberinto el inicial anterior
        if(Object.keys(this.initialState).length !== 0){ // revisamos que haya un inicial anterior
            // ya se había seleccionado un inicial, hay que quitarlo
            // buscamos en los hijos de la celda i,j el div con class initial
            const cell = this.getLabyrinthElement("cell", this.initialState.row, this.initialState.column);
            const initialDiv = cell.getElementsByClassName("initial");
            // initialDiv es un arreglo con todos los hijos de cell que tengan clase initial
            // solo tiene un hijo con clase initial por lo que accedo al índice cero.
            initialDiv[0].style.display = "none";
        }
        // ya se eliminó el inicial anterior (si lo hubo)
        // dibujamos el nuevo inicial
        // obtenos la celda que será nuestra nueva inicial
        const cell = this.getLabyrinthElement("cell", i, j);
        // obtenemos su hijo con clase initial y lo mostramos.
        const initialDiv = cell.getElementsByClassName("initial");
        initialDiv[0].style.display = "block";

        // guardamos esa fila y esa columna en nuestra variable de estado inicial
        this.initialState = {
            row: i,
            column: j
        }
    }

    // función para hacer que la celda i,j sea el estado final
    setFinallState(i,j){
        // borramos del laberinto el final anterior
        if(Object.keys(this.finalState).length !== 0){ // revisamos que haya un final anterior
            // ya se había seleccionado un final, hay que quitarlo
            // buscamos en los hijos de la celda i,j el div con class final
            const cell = this.getLabyrinthElement("cell", this.finalState.row, this.finalState.column);
            const finalDiv = cell.getElementsByClassName("final");
            // final es un arreglo con todos los hijos de cell que tengan clase final
            // solo tiene un hijo con clase final por lo que accedo al índice cero.
            finalDiv[0].style.display = "none";
        }
        // ya se eliminó el final anterior (si lo hubo)
        // dibujamos el nuevo final
        // obtenos la celda que será nuestra nueva final
        const cell = this.getLabyrinthElement("cell", i, j);
        // obtenemos su hijo con clase initial y lo mostramos.
        const finalDiv = cell.getElementsByClassName("final");
        finalDiv[0].style.display = "block";
        // guardamos esa fila y esa columna en nuestra variable de estado final
        this.finalState = {
            row: i,
            column: j
        }
    }

    // función para agregar los hovers que te muestran los detalles de cada celda
    addHovers(){
        // iterar a través de todo el laberinto
        for(let i=0; i < this.fileArray.length; i++){
            for(let j=0; j < this.fileArray[i].length; j++){
                
                // obtengo la celda a la que le voy a agregar el hover
                const element = this.getLabyrinthElement("cell", i, j);
                // obtengo el color original (porque el hover cambia el color
                // y quiero regresar su color cuando termine el hover)
                const originalColor = element.style.backgroundColor;

                // hay dos acciones en el hover. Primero se cambia el color de la celda
                // y si el puntero está más de medio segundo en la celda, se muestra el cuadro
                // con los detalles de la celda

                // myTimeout funciona para dejar de contar el medio segundo si el puntero se sale de la celda
                var myTimeout = null; 

                // evento cuando el mouse entra a la celda
                element.onmouseover = function(){
                    // el color de la celda cambia
                    element.style.backgroundColor = "#F7D8AA"

                    // dentro de medio segundo voy a ejecutar el callback de setTimeout
                    // el callback va a mostrar el cuadro con los datos de la celda.
                    myTimeout = setTimeout(function(){
                        // después de medio segundo se muestra el cuadro con los dadtos de la celda
                        // esto va a suceder solamente si el puntero se mantiene medio segundo sobre la celda
                        // se comporta así por el evento onmouseout que está debajo.

                        // se obtiene el elemento donde voy a pintar el hover
                        let hover = this.getLabyrinthElement("hover", i, j);
                        // obtenemos los datos de la celda
                        let hoverText = this.getCellDetails(i,j);
                        // agregamos los datos al elemento del hover
                        hover.innerHTML = hoverText;
                        // lo hacemos visible
                        hover.style.visibility = "visible";
                    }.bind(this),500);
                }.bind(this);

                //evento cuando el puntero sale de la celda
                element.onmouseout = function(){
                    // regreso la celda a su color original
                    element.style.backgroundColor = originalColor;

                    // obtengo el elemento del hover
                    let hover = this.getLabyrinthElement("hover", i, j);
                    // lo hago invisible
                    hover.style.visibility = "hidden";

                    // este clear timeout funciona para que no se muestren los datos de la celda
                    // si el puntero estuvo menos de medio segundo sobre ella
                    clearTimeout(myTimeout);
                }.bind(this);
            }
        }
    }

    // función que te retorna un string con los detalles de la celda en la coordenada i,j
    getCellDetails(i,j){
        // esta función va a retornar los siguientes datos:
        // si la celda es estado inicial
        // si la celda es estado final
        // el nombre del terreno de la celda
        // los números de visitas de la celda

        // obtengo la celda en la coordenada i,j
        const cell = this.getLabyrinthElement("cell", i, j);
        // creo mis variables para guardar los detalles de la celda
        var initialStr = "";
        var finalStr = "";
        var terrainStr = "";
        var visitsStr = "";

        // determinar si es inicial
        // dentro de initialState se guarda la coordenada del estado inicial
        // si no contiene nada es porque no hay estado inicial
        if(Object.keys(this.initialState).length !== 0){ 
            // contiene algo, hay que ver si sus coordenadas coinciden con i,j
            if(this.initialState.row === i && this.initialState.column === j){
                // si coinciden, el estado es inicial
                initialStr = "Estado inicial: Sí";
            }else{
                // no coinciden, el estado no es inicial
                initialStr = "Estado final: No";
            }
        }else{
            // no hay nada en la variable de estado inicial
            initialStr = "Estado inicial: No";
        }

        // determinar si es final
        // dentro de finalState se guarda la coordenada del estado final
        // si no contiene nada es porque hay estado final
        if(Object.keys(this.finalState).length !== 0){
            // contiene algo, hay que ver si sus coordenadas coinciden con i,j
            if(this.finalState.row === i && this.finalState.column === j){
                // sí coinciden, es el estado final
                finalStr = "Estado final: Sí";
            }else{
                // no coinciden, no es el estado final.
                finalStr = "Estado final: No";
            }
        }else{
            // no hay nada en la variable de estado final
            finalStr = "Estado final: No";
        }

        // obtener el terreno de la celda i,j
        // primero obtenemos el id de terreno dentro de fileArray
        const terrainId = this.fileArray[i][j];

        // buscamos ese id dentro de nuestro arreglo de terrenos
        // el arreglo contiene diccionarios con formato id, idTerreno, nombre, color
        const terrain = this.findTerrain(terrainId);
        // obtenemos el nombre de ese terreno
        terrainStr = `Terreno: ${terrain.name}`;

        // obtener el número de visitas.
        // el número de visitas se guarda dentro del div con clase visit que es hijo de la celda
        const visit = cell.getElementsByClassName("visit")[0].innerHTML;
        visitsStr = `Visitas: ${visit}`;

        // construimos el mensaje con las variables de los detalles de la celda
        const message = `${initialStr}<br>${finalStr}<br>${terrainStr}<br>${visitsStr}`;
        return message;
    }

    // función para obtener el diccionario con los detalles de un terreno
    findTerrain(id){
        var terrain = {} // aquí voy a guardar el diccionario
        
        // itero a través de mi arreglo de terrenos
        for(let i = 0; i < this.terrainValues.length; i++){
            // si encuentro uno cuyo id coincide con el id del parámetro
            // lo guardo en mi diccionario
            if(this.terrainValues[i].id == id){
                terrain = this.terrainValues[i];
                // ya encontré el terreno, cierro el ciclo
                break;
            }
        }
        // retorno el terreno encontrado
        return terrain;
    }

    // proceso para limpiar los estados iniciales y finales
    // esto se usa cuando se recarga un nuevo archivo
    // o cuando se recargan los terrenos
    clearstatesVars(){
        this.initialState = {};
        this.finalState = {};
    }

    // función que te retorna un elemento del laberinto
    // le mandas el nombre del elemento junto a su coordenada
    getLabyrinthElement(name, i, j){
        return document.getElementById(name + i + "," + j);
    }
}

const instance = new Labyrinth();

export default instance;