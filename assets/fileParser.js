class FileParser{
    constructor(fileText){
        this.fileText = fileText.replace(/\r\n|\n\r|\n|\r/g, "\r\n"); // para aceptar cualquier tipo de salto de linea - retorno de carro
        this.fileArray = this.fileText.split("\r\n");
        this.error = "";
    }

    validateFile(){
        const myRegex = /^(\d+,)*(\d+)$/;
        const regex =  new RegExp(myRegex);
        var valid = true;
        console.log(this.fileArray);
        for(let i = 0; i < this.fileArray.length; i++){
            if(!regex.test(this.fileArray[i])){
                // la última fila sí puede ser vacía.
                if(!(i+1 === this.fileArray.length && this.fileArray[i] === "")){
                    const error = this.fileArray[i].replace(/\d,|\d/g, '');
                    const column = this.fileArray[i].indexOf(error);
                    this.error = `Error en: ${i+1}, ${column}`;
                    valid = false;
                }else{
                    // eliminamos del arreglo la cadena vacía.
                    this.fileArray.pop();
                }
            }
        }
        return valid;
    }

    getError(){
        return this.error;
    }

    getFileArray(){
        return this.fileArray;
    }
}

export default FileParser;