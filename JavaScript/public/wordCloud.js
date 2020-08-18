//   //get passed data
//   try {
//   var parsedWords = JSON.parse(words); // this is how you parse a string into JSON 
//   } catch (ex) {
//   console.error(ex);
//   }

//   delete parsedWords.name;
//   delete parsedWords.image;
//   delete parsedWords._id;
//   delete parsedWords.__v;

//   // parsedWords = parsedWords.nouns



// console.log(parsedWords)

//   // Load the Visualization API and the corechart package.
//   google.charts.load('current', {'packages':['corechart']});



//   // Set a callback to run when the Google Visualization API is loaded.
//   // google.charts.setOnLoadCallback(drawChart);
  
  
//   //var input = {};

//   // for (const wordType in parsedWords) {
//   //   if (parsedWords.hasOwnProperty(wordType)) {
//   //     input[wordType] = [];
//   //     // for (let i = 0; i < (parsedWords[wordType].length); i++){
//   //       for (let i = 0; i < (10); i++){

//   //       input[wordType][i] = [parsedWords[wordType][i].word, parsedWords[wordType][i].repeats]; 
//   //     }  

//   //   }
//   // }

  
//   var input = {};
//   var color;
//   for (const wordType in parsedWords) {
//     if (parsedWords.hasOwnProperty(wordType)) {
//         console.log("========"+wordType+"===========")
//         // console.log(parsedWords[wordType][0])
//         input[wordType] = [["Element", "Density", { role: "style" }]];     
//         for (const subtype in parsedWords[wordType][0]){  
//           color = getRandomColor()
//           if (parsedWords[wordType][0][subtype].length>0){     
//             for (let i=0; i<parsedWords[wordType][0][subtype].length; i++){
//               // console.log(wordType+"_"+subtype)
//               // input[wordType+"_"+subtype][i] = [parsedWords[wordType][0][subtype][i].word, parsedWords[wordType][0][subtype][i].repeats]
//               input[wordType][input[wordType].length] = [parsedWords[wordType][0][subtype][i].word, parsedWords[wordType][0][subtype][i].repeats, color]

//             }
            
//           }
//         } 
//         // console.log(input[wordType])
//         // input[wordType][i] = [parsedWords[wordType][i].word, parsedWords[wordType][i].repeats]; 
//     }
//   }

//   // console.log(input["nouns"].unshift["Element", "Density", { role: "annotation" }])
//   google.charts.setOnLoadCallback(function () {

//     for (const wordType in input) {
//       console.log(wordType)
//       drawChart(input[wordType], wordType);
//     }
//   });

  
//   window.onresize = doALoadOfStuff;
//   function doALoadOfStuff() {

//     google.charts.setOnLoadCallback(function () {

//     for (const wordType in parsedWords) {
//         drawChart(input[wordType], wordType);
//       }
//     });

//   }


//   // Callback that creates and populates a data table,
//   // instantiates the pie chart, passes in the data and
//   // draws it.
//   function drawChart(input, wordType) {

//   // Create the data table.

//   // var data = new google.visualization.DataTable();
//   // data.addColumn('string', 'Rijec');
//   // data.addColumn('number', 'Ponavljanja');
//   // data.addColumn('string', {role: 'annotation'});

//   // data.addRows(parsedWords[wordType]);
//   // data.addRows(input);
//   var data = google.visualization.arrayToDataTable(input)





//   // Set chart options
//   var options = {'title': wordType,
//                   'width': '100%',
//                   'height': '100%',
//                   'backgroundColor': { fill:'transparent'},
//                   // 'legend': {position: 'none'},
//                   'animation':{
//                     duration: 1000,
//                     easing: 'out',
//                     startup: true},
//                   'chartArea':{backgroundColor: {stroke: 'black'}},
//                   // 'colors': ['lightblue'],
//                   'hAxis': {baseline: 0, gridlines: {count:0}, title: 'Broj ponavljanja'},
//                   'vAxis': {textPosition: 'in', title: 'Rijec'},
//                   'fontSize': 20
//                 };

//   // Instantiate and draw our chart, passing in some options.
//   var chart = new google.visualization.BarChart(document.getElementById(wordType));
//   chart.draw(data, options);
//   }



//   function getRandomColor() {
//     var letters = '0123456789ABCDEF';
//     var color = '#';
//     for (var i = 0; i < 6; i++) {
//       color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
//   }