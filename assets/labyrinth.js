const FileParser = require('./fileParser.js');
const labFile = localStorage.getItem('labFile');
const labyrinthElement = document.getElementById("labyrinth");


labyrinthElement.innerHTML = labFile