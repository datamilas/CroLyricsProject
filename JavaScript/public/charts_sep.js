
//get passed data
try {
    var parsedWords = JSON.parse(words); // this is how you parse a string into JSON 
    } catch (ex) {
    console.error(ex);
    }
  
    delete parsedWords.name;
    delete parsedWords.image;
    delete parsedWords._id;
    delete parsedWords.__v;
    
  
  console.log(parsedWords)
  
  

  
  
    
    var input = {};
    const colors = ["red", "blue", "yellow", "green", "purple", "brown"];
    var Labels=[];
    var Data=[];
    var Subtypes = [];
    for (const wordType in parsedWords) {
      if (parsedWords.hasOwnProperty(wordType)) {

        Labels=[];
        Data=[];
        Subtypes = [];
          console.log("========"+wordType+"===========")
          // console.log(parsedWords[wordType][0])
          input[wordType] = [["Element", "Density", { role: "style" }]];     
          for (const subtype in parsedWords[wordType][0]){  
            if (parsedWords[wordType][0][subtype].length>0){     
              for (let i=0; i<parsedWords[wordType][0][subtype].length; i++){
                // console.log(wordType+"_"+subtype)
                // input[wordType+"_"+subtype][i] = [parsedWords[wordType][0][subtype][i].word, parsedWords[wordType][0][subtype][i].repeats]
                // input[wordType][input[wordType].length] = [parsedWords[wordType][0][subtype][i].word, parsedWords[wordType][0][subtype][i].repeats, colors]
                Labels.push(parsedWords[wordType][0][subtype][i].word);
                Data.push(parsedWords[wordType][0][subtype][i].repeats);
                Subtypes.push(subtype);
              }
              
            }
          } 
          
         drawChart(Labels, Data, Subtypes, wordType);

      }
    }






  

function drawChart(Labels, Data, Subtypes, wordType) {
    var ctx = document.getElementById(wordType).getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
        labels: ['value 1', 'value 2', 'value 3', 'value 4'],
        datasets: [{
            label: 'Dataset 1',
            backgroundColor: [
              "blue",
              "blue",
              "blue",
              "blue"
            ],
            data: [60, 40, 30, 20],
            subtype: ["common", "proper", "proper", "common"]
          }]
        }
      });

      

            
      var dataset = myChart.data.datasets[0];
      dataset.subtype = Subtypes;
      dataset.data = Data;
      myChart.data.labels = Labels;

      const unique = (value, index, self) => {
        return self.indexOf(value) === index
      }
      
      const totalSubtypes = Subtypes.filter(unique);

      var legendHTML = '';
      for (const [index, value] of totalSubtypes.entries()){
        for (var i = 0; i < dataset.data.length; i++) {
          if (dataset.subtype[i] == value) {
            dataset.backgroundColor[i] = colors[index];
          }
        }
        
        // if (totalSubtypes.length > 1) {
          legendHTML += ('<li><span style="background: ' + colors[index] + '"></span>' + value + '</li>');
        // }
        
      }

      document.getElementById(wordType+"Legend").innerHTML = '<ul class="chartLegend">' + legendHTML + '</ul>';

      

      myChart.update();



}




