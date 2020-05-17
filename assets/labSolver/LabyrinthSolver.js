import Labyrinth from '../labyrinth.js';
import LabyrinthMovement from '../labyrinthMovement.js';
import DepthFirstSearch from './DepthFirstSearch.js';
import UniformCost from './UniformCost.js';
import AStar from './AStar.js';
import Greedy from './Greedy.js'

class LabyrinthSolver{
    constructor(){
        this.labyrinthMovement = new LabyrinthMovement();
        this.depthFirstSearch = new DepthFirstSearch();
        this.uniformCost = new UniformCost();
        this.aStar = new AStar();
        this.greedy = new Greedy();
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
            this.greedy.solve();
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
            this.greedy.stop();
        }else if(solverType == "AStar"){
            this.aStar.stop();
        }

        // borrar el grafo.
        document.getElementById("labyrinthGraph").innerHTML = "";
        const costDiv = document.getElementById("solutionCost");
        costDiv.innerHTML = '';
    }
}

export default LabyrinthSolver;