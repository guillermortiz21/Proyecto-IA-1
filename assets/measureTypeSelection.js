import Labyrinth from './labyrinth.js';

class MeasureTypeSelection{
    constructor(){}

    setVariables(){
        this.typeMeasureForm = document.getElementById("typeMeasureForm");
        this.submitTypeMeasureFormButton = document.getElementById("submitTypeMeasuresFormButton");
        this.typeMeasureSelection = document.getElementById("typeMeasureSelection");
        this.setListener(); // para escuchar el click del botón
    }

    setListener(){
        this.submitTypeMeasureFormButton.onclick = this.saveMeasureType.bind(this);
    }

    saveMeasureType(){
        if(document.querySelector('input[name="measureType"]:checked')){
            const msType = document.querySelector('input[name="measureType"]:checked').value;
            Labyrinth.setMeasureType(msType);
            console.log(msType);
            this.hideMeasureForm();
        }else{
            alert("No se seleccionó ningún tipo de medida");
            return;
        }
    }

    drawMeasureTypeForm(){
        this.setVariables();
        this.typeMeasureForm.style.display = "block";
        var divContent = '';
        divContent += '<p style="text-align: center">Tipos de medida</p>';
        divContent += '<div class="colorsList">';
            divContent += '<div class="radioContainer">';
                divContent += '<div class="radioContainer"><input type="radio" id="radio-Euclidean" name="measureType" value="Euclidean"></div>'
                divContent += '<label for="Euclidean">Euclidiana</label>'

                divContent += '<div class="radioContainer"><input type="radio" id="radio-Manhattan" name="measureType" value="Manhattan"></div>'
                divContent += '<label for="Euclidean">Manhattan</label>'

            divContent += '</div>';
        divContent += '</div>';

        this.typeMeasureSelection.innerHTML = divContent;
        document.getElementById("radio-" + Labyrinth.getMeasureType()).checked = true 
        //console.log(Labyrinth.getMeasureType());
    }

    hideMeasureForm(){
        this.typeMeasureForm.style.display = "none";
    }

}

export default MeasureTypeSelection;