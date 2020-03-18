import FileParser from './fileParser.js';
const labFile = localStorage.getItem('labFile');
const labyrinthElement = document.getElementById("labyrinth");

const fileParser = new FileParser(labFile);
if(fileParser.validateFile()){
    console.log("Valido");
    const fileArray = fileParser.getFileArray();
    fileArray.forEach(row => {
        labyrinthElement.innerHTML += row + '<br>'
    });
    
}else{
    alert(fileParser.getError());
}

