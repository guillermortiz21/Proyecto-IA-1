import terrainOptions from './terrainOptions.js';
import Labyrinth from './labyrinth.js'


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

        // ya está la tabla hecha, pero todos los cuadritos de color de terreno son color negro
        // (el cuadrito que se ve debajo de cada nombre de terreno)
        // Hay que cambiar el color de cada uno de esos cuadritos al su respectivo color de terreno
        // en terrainOptions tenemos diccionarios con el id de terreno, su nombre y su color
        // iteramos por cada uno de esos diccionarios
        for(let j=0; j < terrainOptions.length; j++){
            // para cada uno de ellos, obtenemos los elementos html del formulario cuya clase sea el id del terreno
            let elements = document.getElementsByClassName(terrainOptions[j].id);
            // en elements tenemos ahora todos los cuadritos de color que aparecen debajo de los nombres de un terreno
            for(let i = 0; i < elements.length; i++){
                // cambiamos el color de cada uno de esos cuadritos al color de su terreno
                // correspondiente
                elements[i].style.backgroundColor = terrainOptions[j].color;
            }
        }

        // puede ser que estemos modificando los terrenos, por lo que hay que recuperar
        // los radioboxes que fueron seleccionados anteriormente.
        this.setAlreadySelectedValues();

    }

    setAlreadySelectedValues(){
        // en terrain values están guardadas las relaciones entre el id de terreno y su nombre y color.
        // la primera vez que se ejecuta el laberinto este arreglo está vacío.
        // pero se llena cuando se seleccionan los tipos de terreno.
        const terrainValues = Labyrinth.getTerrrainValues();
        for(let i = 0; i < terrainValues.length; i++){
            // entro aquí si el arreglo no está vacío
            // selecciono los radio boxes que ya se habían seleccionado anteriormente.
            document.getElementById("terrain" + terrainValues[i].terrainId + terrainValues[i].id).checked = true;
        }
    }

    // está función se ejecuta cuando se hace click en el botón de guardar terrenos, hasta abajo del form.
    // la función va a validar que todos los ids tengan un terreno seleccionado
    // y que un mismo terreno no esté en más de 1 id de terreno.
    // si todo es correcto, se va a llenar el arreglo de terrainValues y se va a
    // disparar el evento para dibujar el laberinto.
    terrainButtonClick(event){
        this.terrainValues = [] // en este arreglo se va a guardar el diccionarios de id - nombre - color de cada terreno
        var valid = true; // bandera para validar la correcta selección de terrenos
        var error = "Se encontraron los siguientes errores:\n"; // variable para guardar erroes si los hay.

        // itero a través de todos los ids de terreno (cada id debe tener un terreno seleccionado)
        for(let i=0; i < this.terrainsIds.length; i++){
            let id = this.terrainsIds[i]; // obtengo el id
            // busco cual de mi radio group correspondiente a ese id está seleccionado.
            let selected = document.querySelector('input[name="terrain' + id + '"]:checked');
            if(selected){
                // si uno sí se seleccionó obtengo el valor de ese seleccionado (que es el id del terreno)
                selected = selected.value;
                // busco ese terreno seleccionado en mis opciones de terreno
                let terrain = this.findTerrain(selected);
                // creo un diccionario con mi id de terreno y los datos del terreno que se seleccionó
                let values  = {
                    id: id,
                    terrainId: terrain.id,
                    name: terrain.name,
                    color: terrain.color
                }
                // inserto dicho diccionario en mi arreglo de terrainValues
                this.terrainValues.push(values);
            }else{
                // agrego a mis errores que ningún terreno se selecciono para ese id
                error += `No has elegido ningún terreo para el id ${id}\n`;
                valid = false;
            }
            
        }

        // vaid se hace falso si hubo ids sin terreno seleccionado
        if(!valid){
            // muestro el error y termino la ejecución
            // el programa regresa al formulario y se queda ahí hasta que se seleccionen bien los valores
            alert(error);
            return;
        }
        // validamos que  no se hayan seleccionado el mismo terreno dos veces
        // la función regresa un diccionario con una bandera de válido y los errores.
        let validTerrain = this.validateTerrainSelection();


        if(validTerrain.valid){
            // todo correcto
            // cerrar ventana
            // al cambiar el display a none se dispara un evento que hace que el laberinto se dibuje
            this.terrainFormModal.style.display = "none";
        }else{
            // si no es válido se muestra el error
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

    // validar que no se haya seleccionado el mismo terreno dos veces
    validateTerrainSelection(){
        var selectedTerrains = []
        var valid = true;
        var error = "Se encontraron los siguientes errores:\n";
        for(let i = 0; i < this.terrainValues.length; i++){
            // indexOf regresa -1 si NO encuentra el elemento dentro del arreglo
            // el selectedTerrains voy a estar insertando todos los terrenos que se seleccionaron.
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

