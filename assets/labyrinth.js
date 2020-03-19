import FileParser from './fileParser.js';
import TerrainForm from './terrainForm.js';

const labFile = localStorage.getItem('labFile');
const labyrinthElement = document.getElementById("labyrinth");


const fileParser = new FileParser(labFile);
const terrainForm = new TerrainForm();

const drawLabyrinth = function(){
    const fileArray = fileParser.getFileArray();
    fileArray.forEach(row => {
        labyrinthElement.innerHTML += row + '<br>'
    });
}

const labyrinth = function(){
    if(fileParser.validateFile()){
        const terrainsIds = fileParser.getTerrainsIds();
        terrainForm.setTerrainsIds(terrainsIds);
        terrainForm.drawTerrainsForm();
        //drawLabyrinth();
    }else{
        alert(fileParser.getError());
    }
}

labyrinth();