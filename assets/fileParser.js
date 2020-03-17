class FileParser{
    constructor(fileText){
        this.fileText = fileText.replace(/\r\n|\n\r|\n|\r/g, "\r\n"); // para aceptar cualquier tipo de salto de linea - retorno de carro
        this.rows = this.fileText.split("\n");
    }



    validateFile(){
        const regex = /^(\d+,)*(\d+)$/;
        var i = 1;
        this.rows.forEach(row => {
            console.log(row);
            if(regex.test(row)){
                console.log("Error en la fila ", i);
                return false;
            }
            i++;
        });
        return true;
    }
}

export default FileParser;