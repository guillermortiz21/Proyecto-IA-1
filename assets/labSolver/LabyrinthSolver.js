import Labyrinth from '../labyrinth.js';
import LabyrinthMovement from '../labyrinthMovement.js';
import DepthFirstSearch from './DepthFirstSearch.js';

class LabyrinthSolver{
    constructor(){
        this.labyrinthMovement = new LabyrinthMovement();
        this.depthFirstSearch = new DepthFirstSearch();
    }

    solve(){
        const solverType = Labyrinth.getSolverType();
        Labyrinth.setLabyrinthWorking(true);
        if(solverType == "Manual"){
            this.labyrinthMovement.startLabyrinth();
        }else if(solverType == "Depth"){
            this.depthFirstSearch.solve();
        }
    }

    stop(){
        const solverType = Labyrinth.getSolverType();
        Labyrinth.setLabyrinthWorking(false);
        if(solverType == "Depth"){
            this.depthFirstSearch.stop();
        }

        // borrar el grafo.
        document.getElementById("labyrinthGraph").innerHTML = "";
    }
}

export default LabyrinthSolver;