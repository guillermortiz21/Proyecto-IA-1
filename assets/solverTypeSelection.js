import Labyrinth from './labyrinth.js';

class SolverTypeSelection{
    constructor(){}

    setVariables(){
        this.solverTypeForm = document.getElementById("solverTypeForm");
        this.submitSolverTypeFormButton = document.getElementById("submitSolverTypeFormButton");
        this.solverTypeSelection = document.getElementById("solverTypeSelection");
        this.setListenters(); // para escuchar el click del botón
    }

    setListenters(){
        this.submitSolverTypeFormButton.onclick = this.saveSolverType.bind(this);
    }

    saveSolverType(){
        if(document.querySelector('input[name="solverType"]:checked')){
            const checkedValue = document.querySelector('input[name="solverType"]:checked').value;
            Labyrinth.setSolverType(checkedValue);
            this.hideOrderForm();
            console.log(Labyrinth.getSolverType());
        }else{
            alert("No se seleccionó ningún tipo de solución");
            return;
        }
    }

    drawSolverTypeForm(){
        this.setVariables();
        this.solverTypeForm.style.display = "block";
        var divContent = '';
        divContent += '<p style="text-align: center">Tipos de solución</p>';
        divContent += '<div class="colorsList">';
            divContent += '<div class="radioContainer">';
                divContent += '<div class="radioContainer"><input type="radio" id="radio-Manual" name="solverType" value="Manual"></div>'
                divContent += '<label for="Manual">Manual</label>'

                divContent += '<div class="radioContainer"><input type="radio" id="radio-Depth" name="solverType" value="Depth"></div>'
                divContent += '<label for="Depth">Profundidad</label>'

                divContent += '<div class="radioContainer"><input type="radio" id="radio-UniformCost" name="solverType" value="UniformCost"></div>'
                divContent += '<label for="Depth">Costo uniforme</label>'

                divContent += '<div class="radioContainer"><input type="radio" id="radio-Greedy" name="solverType" value="Greedy"></div>'
                divContent += '<label for="Depth">Voraz primero el mejor</label>'

                divContent += '<div class="radioContainer"><input type="radio" id="radio-AStar" name="solverType" value="AStar"></div>'
                divContent += '<label for="Depth">A*</label>'
            divContent += '</div>';
        divContent += '</div>';

        this.solverTypeSelection.innerHTML = divContent;
        document.getElementById("radio-" + Labyrinth.getSolverType()).checked = true 
    }

    hideOrderForm(){
        this.solverTypeForm.style.display = "none";
    }
}

export default SolverTypeSelection;
