import Labyrinth from '../labyrinth.js';
import LabyrinthMovement from '../labyrinthMovement.js';
import DepthFirstSearch from './DepthFirstSearch.js';
import UniformCost from './UniformCost.js';

class LabyrinthSolver{
    constructor(){
        this.labyrinthMovement = new LabyrinthMovement();
        this.depthFirstSearch = new DepthFirstSearch();
        this.uniformCost = new UniformCost();
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
            // correr aquí la función para iniciar el algoritmo de a *
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
            // correr aquí la función para parar el algoritmo de a *
        }

        // borrar el grafo.
        document.getElementById("labyrinthGraph").innerHTML = "";
    }
}

export default LabyrinthSolver;