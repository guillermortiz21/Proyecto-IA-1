import Labyrinth from '../labyrinth.js';
import LabyrinthMovement from '../labyrinthMovement.js';
import DepthFirstSearch from './DepthFirstSearch.js';
import UniformCost from './UniformCost.js';
import AStar from './AStar.js';

class LabyrinthSolver{
    constructor(){
        this.labyrinthMovement = new LabyrinthMovement();
        this.depthFirstSearch = new DepthFirstSearch();
        this.uniformCost = new UniformCost();
        this.aStar = new AStar();
    }

    solve(){
        const solverType = Labyrinth.getSolverType();
        Labyrinth.setLabyrinthWorking(true);
        if(solverType == "Manual"){
            this.labyrinthMovement.startLabyrinth();
        }else if(solverType == "Depth"){
            this.depthFirstSearch.solve();
        }else if(solverType == "UniformCost"){
            this.uniformCost.solve();
        }else if(solverType == "Greedy"){
            // correr aquí la función para iniciar el algorimo de voraz
        }else if(solverType == "AStar"){
            this.aStar.solve();
        }
    }

    stop(){
        const solverType = Labyrinth.getSolverType();
        Labyrinth.setLabyrinthWorking(false);
        if(solverType == "Depth"){
            this.depthFirstSearch.stop();
        }else if(solverType == "UniformCost"){
            this.uniformCost.stop();
        }else if(solverType == "Greedy"){
            // correr aquí la función para parar el algorimo de voraz
        }else if(solverType == "AStar"){
            this.aStar.stop();
        }

        // borrar el grafo.
        document.getElementById("labyrinthGraph").innerHTML = "";
    }
}

export default LabyrinthSolver;