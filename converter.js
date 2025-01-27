let csvToJson = require('convert-csv-to-json');

let fileInputName = 'statsWorlds2024.csv'; 
let fileOutputName = 'statsWorlds2024.json';

csvToJson.generateJsonFileFromCsv(fileInputName,fileOutputName);