const labFileElement = document.getElementById("labFile");

labFileElement.addEventListener('change', function(){
    // dentro de this.files hay un arreglo de archivos
    // hay que validar que sí haya algún archivo y obtenemos el primero.
    const allFiles = this.files;
    if(allFiles.length === 0){
        alert('Error: No se seleccionó ningún archivo.');
        return;
    }
    const labFile = allFiles[0];

    // ya tenemos el archivo, ahora validamos que sea un txt
    console.log(labFile.type);
});