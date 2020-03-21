const labFileElement = document.getElementById("labFile");
import Labyrinth from './assets/Labyrinth.js'

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
    if(labFile.type !== "text/plain"){
        alert("Error: el archivo debe ser un archivo de texto");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event){
        const fileContents = event.target.result;
        localStorage.setItem('labFile', fileContents);
        window.location.href = './assets/labyrinth.html'
    }

    reader.onerror = function(err){
        alert("Error en la lectura del archivo.");
    }

    reader.readAsText(labFile);
});