import Labyrinth from '../labyrinth.js';
import LabyrinthMovement from '../labyrinthMovement.js';
import DepthFirstSearch from './DepthFirstSearch.js';

class LabyrinthSolver{
    constructor(){
        this.labyrinthMovement = new LabyrinthMovement();
        this.depthFirstSearch = new DepthFirstSearch();
    }

    solve(){
        const solvingMode = Labyrinth.solvingMode;
        if(solvingMode == "Manual"){
            this.labyrinthMovement.startLabyrinth();
        }else if(solvingMode == "Depth"){
            this.depthFirstSearch.solve();
        }
    }

    stop(){
        const solvingMode = Labyrinth.solvingMode;
        if(solvingMode == "Depth"){
            this.depthFirstSearch.stop();
        }

        // borrar el grafo.
        document.getElementById("labyrinthGraph").innerHTML = "";
    }
}

export default LabyrinthSolver;