import Labyrinth from './labyrinth.js'

class FileParser{
    constructor(){
        this.labFile = Labyrinth.getLabFile();
        this.fileText = "";
        this.fileArray = "";
        this.error = "Se encontraron los siguientes errores:\n";
        this.maxLabSize = 15;
        this.terrainsIds = [];
        this.maxTerrains = 10;
    }

    createFileArray(){
        this.fileText = this.labFile.replace(/\r\n|\n\r|\n|\r/g, "\r\n"); // para aceptar cualquier tipo de salto de linea - retorno de carro
        this.fileArray = this.fileText.split("\r\n");
    }


    parseAndValidateFile(){
        // crear arreglo con cada una de las filas del archivo.
        this.createFileArray();

        // revisar que el archivo solo contenga números y comas.
        // no pueden haber filas vacías.
        if(!this.validateCharacters()){
            return false;
        }

        // validar máximo 15 rows
        if(!this.validateMaxRows()){
            return false;
        }

        // separar cada fila en arreglos de números.
        // validar que no la anchura no pase de 15
        // validar que todas las filas tengan la misma anchura.
        if(!this.validateRowSize()){
            return false;
        }

        // crear arreglo con terrenos 
        // y validar que no haya más de 10
        if(!this.validateMaxTerrains()){
            return false;
        }
        return true;
    }

    validateCharacters(){
        const myRegex = /^(\d+,)*(\d+)$/;
        const regex =  new RegExp(myRegex);
        var valid = true;
        // revisar que el archivo solo contenga números y comas.
        // no pueden haber filas vacías.
        for(let i = 0; i < this.fileArray.length; i++){
            if(!regex.test(this.fileArray[i])){
                // la última fila sí puede ser vacía.
                if(!(i+1 === this.fileArray.length && this.fileArray[i] === "")){
                    const error = this.fileArray[i].replace(/\d,|\d/g, '');
                    const column = this.fileArray[i].indexOf(error);
                    this.error += `Error en el archivo en: ${i+1}, ${column}\n`;
                    valid = false;
                }else{
                    // eliminamos del arreglo la última fila del archivo, que es vacía
                    this.fileArray.pop();
                }
            }
        }
        return valid;
    }

    validateMaxRows(){
        // validar máximo 15 rows
        if(this.fileArray.length > this.maxLabSize){
            this.error += `El archivo tiene más de 15 filas.\n`;
            return false;
        }
        return true;
    }

    validateRowSize(){
        // separar cada fila en arreglos de números.
        // validar que no la anchura no pase de 15
        // validar que todas las filas tengan la misma anchura.
        var valid = true;
        var rowSize = 0;
        for(let i = 0; i < this.fileArray.length; i++){
            this.fileArray[i] = this.fileArray[i].split(",");
            if(i === 0){
                rowSize = this.fileArray[0].length;
                // no anchura mayor a 15
                if(rowSize > this.maxLabSize){
                    this.error += `El archivo tiene anchura mayor a 15\n`;
                    valid = false;
                }
            }
            if(this.fileArray[i].length !== rowSize){
                this.error += `La fila ${i+1} tiene anchura distinta a ${rowSize}\n`;
                valid = false;
            }
        }
        return valid;
    }

    validateMaxTerrains(){
        // agregar los distintos id de terreno al arreglo de terrenos.
        // tenemos que recorrer todo.
        var valid = true;
        for(let i=0; i < this.fileArray.length; i++){
            for(let j=0; j < this.fileArray[i].length; j++){
                // eliminamos ceros a la izquierda
                // si son ceros, solo dejamos un cero
                if(/^0+$/.test(this.fileArray[i][j])){
                    this.fileArray[i][j] = "0";
                }else{
                    // si son ceros acompañados de otro número borramos los ceros.
                    this.fileArray[i][j] = this.fileArray[i][j].replace(/^0+/, "");
                }
                // indexOf regresa -1 si no encuentra el elemento
                if(this.terrainsIds.indexOf(this.fileArray[i][j]) === -1){
                    // no está en el arreglo, lo agregamos.
                    this.terrainsIds.push(this.fileArray[i][j]);
                }
            }
        }
        if(this.terrainsIds.length > this.maxTerrains){
            this.error += `Hay más de ${this.maxTerrains} terrenos en el archivo.`;
            valid = false;
        }
        return valid;
    }

    getError(){
        return this.error;
    }

    getFileArray(){
        return this.fileArray;
    }

    getTerrainsIds(){
        return this.terrainsIds;
    }
}

export default FileParser;