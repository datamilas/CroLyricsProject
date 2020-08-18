var myCharts = {};


function removeArray(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}


const unique = (value, index, self) => {
    return self.indexOf(value) === index;
}


const updateChart = (myChart, Labels, Data, Subtypes, subtypeToColor, wordType) => {

    const dataset = myChart.data.datasets[0];
    dataset.subtype = Subtypes;
    dataset.data = Data;
    myChart.data.labels = Labels;
  
    for (const colorCode of subtypeToColor){
        for (var i = 0; i < dataset.data.length; i++) {
            if (dataset.subtype[i] == colorCode.subtype) {
                dataset.backgroundColor[i] = colorCode.color;
            };
        };
    };
};



const drawChart = (index, Labels, Data, Subtypes, wordType, subtypeToColor) => {

    if (!myCharts[`${wordType}${index}`]) {
        const ctx = document.getElementById(`${wordType}${index}`).getContext('2d');
            myChart = new Chart(ctx, {
                type: 'horizontalBar',
                data: {
                labels: [],
                datasets: [{
                    backgroundColor: [
                    ],
                    data: []
                }]
                },
                options: {
                    legend: {
                        display: false
                    },

                    scales: {
                        yAxes: [{ticks: {mirror: true}}],
                        xAxes: [{ticks: {beginAtZero: true}}]
                    },
                }
            });       
        myCharts[`${wordType}${index}`] = myChart;
    }

    else{
        myChart = myCharts[`${wordType}${index}`];
    }

    updateChart(myChart, Labels, Data, Subtypes, subtypeToColor, wordType)
    myChart.update();


}



const updateData = (parsedWords, index, wordType, subtypesToInclude, numberOfBars, subtypeToColor) => {
    let Labels=[];
    let Data=[];
    let Subtypes = [];
    let numberSelector = '';



    for (let i = 0; i < (parsedWords[wordType].length); i++){   
        if (subtypesToInclude.includes(parsedWords[wordType][i].type)){
            Labels.push(parsedWords[wordType][i].word);
            Data.push(parsedWords[wordType][i].repeats);
            Subtypes.push(parsedWords[wordType][i].type);
        }      
    }

    if (numberOfBars>Data.length){
        numberOfBars = Data.length;
    }

    for (let i = 1; i < (Data.length)+1; i++){
        if (i==numberOfBars){     
            numberSelector += `<option value=${i} selected>${i}</option>`;
        } else{
            numberSelector += `<option value=${i}>${i}</option>`;
        }    
    }
    document.getElementById(`${wordType}${index}Number`).innerHTML = numberSelector;

    Labels = Labels.slice(0, numberOfBars);
    Data = Data.slice(0, numberOfBars);
    Subtypes = Subtypes.slice(0, numberOfBars);

    drawChart(index, Labels, Data, Subtypes, wordType, subtypeToColor);

}




const updateDataAndDrawChart = (
    parsedWords,
    index = 0,
    layout = "rows", 
    wordTypes = Object.keys(parsedWords), 
    numberOfBars = 10, 
    colors = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
    ]) => {
    
    


    document.getElementById(layout).insertAdjacentHTML("beforeend",
                `<div class="artistColumn">           
                    <div class="artistInfo">
                        <p class="artistName">${parsedWords.name}</p>
                        <img src= "${parsedWords.image}" width="300" height="300" class="artistImage" alt="${parsedWords.name}">
                    </div>
                </div>`
    );


    delete parsedWords.name;
    delete parsedWords.image;
    delete parsedWords._id;
    delete parsedWords.__v;    



    for (let wordType of wordTypes) {
        if (parsedWords.hasOwnProperty(wordType)) {

            document.getElementsByClassName("artistColumn")[index].insertAdjacentHTML("beforeend", 

                `<div class="col chartBox">             
                <canvas id="${wordType}${index}" class="chart" width="300" height="300"></canvas>
                <div id="${wordType}${index}Legend"></div>
                <div>
                    <label class="numberLabel" for="${wordType}${index}Number">Izaberi broj rijeci za prikaz:</label>
                    <select name="${wordType}${index}Number" id="${wordType}${index}Number">
                    </select>
                </div>
                </div>`)


            let numberSelector = '';
            let Subtypes = [];
            let legendHTML = '';

            let subtypeToColor = [];
            console.log("========"+wordType+"===========")

            // Add legends and number selectors
            for (let i = 1; i < (parsedWords[wordType].length); i++){
                Subtypes.push(parsedWords[wordType][i].type);

                if (i===numberOfBars){
                    numberSelector += `<option value=${i} selected>${i}</option>`;
                } else{
                    numberSelector += `<option value=${i}>${i}</option>`;
                }    
            }

            document.getElementById(`${wordType}${index}Number`).innerHTML = numberSelector;


            const totalSubtypes = Subtypes.filter(unique);
            const subtypesToInclude = totalSubtypes;

            for (const [i, value] of totalSubtypes.entries()){
                subtypeToColor.push({subtype: value, color: colors[i]}); 
                legendHTML += (`<li style="color: ${colors[i]}"><input type="checkbox" name= "${wordType}${index}${value}Legend" checked><label>${value}</label></input></li>`);
            }  
            legend = `<ul class = "chartLegend"  id = "${wordType}${index}Legend">${legendHTML}</ul>`;
        
            // let subtypeToColor = subtypeToColorTemp;

            // Listeners for legends
            document.getElementById(`${wordType}${index}Legend`).innerHTML = legend;

            for (const [i, value] of totalSubtypes.entries()){
                
                let legendSelectorListener = document.querySelector(`input[name=${wordType}${index}${value}Legend]`);

                legendSelectorListener.addEventListener( 'change', (event) => {
                    if(event.target.checked) {
                        subtypesToInclude.push(value);
                        subtypeToColor.push({subtype: value, color: colors[i]}); 
                    } else {
                        removeArray(subtypesToInclude, value);    
                    }
                    updateData(parsedWords, index, wordType, subtypesToInclude, numberOfBars, subtypeToColor);
                });    
            }

            let mainLegendSelectorListener = document.getElementById(`${wordType}${index}Legend`);
                mainLegendSelectorListener.addEventListener( 'change', () => {
                    console.log("main legend changed");
                    updateData(parsedWords, index, wordType, subtypesToInclude, numberOfBars, subtypeToColor);
            });

            // Listeners for number selectors            
            let numberSelectorListener = document.getElementById(`${wordType}${index}Number`);

            numberSelectorListener.addEventListener('change', (event) => {
                numberOfBars = event.target.value;
                updateData(parsedWords, index, wordType, subtypesToInclude, numberOfBars, subtypeToColor);
            });

            updateData(parsedWords, index, wordType, subtypesToInclude, numberOfBars, subtypeToColor);

            
        }
    }
}









//get passed data
try {
    var parsedWords = JSON.parse(words); // this is how you parse a string into JSON 
    } catch (ex) {
    console.error(ex);
    }

 
for (const [index, artist] of parsedWords.entries()) {

    updateDataAndDrawChart(artist, index, layout = "columns");


}





