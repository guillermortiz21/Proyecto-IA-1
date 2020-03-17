import FileParser from './fileParser.js';
const labFile = localStorage.getItem('labFile');
const labyrinthElement = document.getElementById("labyrinth");

const fileParser = new FileParser(labFile);
if(fileParser.validateFile()){
    console.log("Valido");
}else{
    console.log("No valido");
}

labyrinthElement.innerHTML = labFile