const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//pull the demographic info pair from metadata base on the sample on init
function demo_data(sample) {
    d3.json(url).then((data) => {
        let metadata = data.metadata;
        let resultarray = metadata.filter(x => x.id == sample) //filter for the argument sample to match with id
        let result = resultarray[0]
        let table = d3.select("#sample-metadata")
        table.html("") //clear the data on the table
        //for (key in result) {
        //    table.append("h6").text(`${key}: ${result[key]}`)
        //}
        Object.entries(result).forEach(([key, value]) => {
            table.append("h6").text(`${key}: ${value}`)
        })

    })

}
// plot the sample data from samples base on the sample on init
function plot_data(sample) {
    d3.json(url).then((data) => {
        let sampledata = data.samples;
        let resultarray = sampledata.filter(x => x.id == sample)
        let result = resultarray[0]
        let otu_ids = result.otu_ids
        let sample_value = result.sample_values
        let otu_labels = result.otu_labels

        // Bar Chart
        var trace1 = {
            x: sample_value.slice(0, 10).reverse(),
            y: otu_ids.slice(0, 10).map(otu_ids => ` OTU ${otu_ids}`).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        };
        var data = [trace1];
        var layout = {
            title: "Top Ten OTUs of " + sample,
        };
        Plotly.newPlot("bar", data, layout);


        // Bubble Chart
        var trace2 = {
            x: otu_ids,
            y: sample_value,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_value,
                color: otu_ids,
                colorscale: "jet"
            }
        };
        var data = [trace2];
        var layout = {
            xaxis: { title: "OTU ID " + sample },

        };
        Plotly.newPlot('bubble', data, layout);

    })

}

// plot for the gauge chart 
function plot_gauge(sample) {
    d3.json(url).then((data) => {
        let metadata = data.metadata;
        let resultarray = metadata.filter(x => x.id == sample)
        let wfreq = resultarray[0]["wfreq"]
        console.log(wfreq)

        // Gauge chart 
        var trace3 = [
            {
                type: "indicator",
                mode: "gauge+number",
                value: wfreq,
                title: { text: "Belly Button Washing Frequency <br><i>Scrubs per Week</i>", font: { size: 20 } },
                gauge: {

                    axis: { range: [null, 9] },
                    steps: [
                        { range: [0, 1], color: '#009a60' },
                        { range: [1, 2], color: '#4aa84e' },
                        { range: [2, 3], color: '#92b73a' },
                        { range: [3, 4], color: '#c6bf22' },
                        { range: [4, 5], color: '#edbd02' },
                        { range: [5, 6], color: '#ffad00' },
                        { range: [6, 7], color: '#ff8c00' },
                        { range: [7, 8], color: '#fc6114' },
                        { range: [8, 9], color: '#f43021' },

                    ],

                }
            }
        ];

        var data = trace3

        var layout = {

            margin: { t: 55, r: 25, l: 25, b: 25 },


        };
        Plotly.newPlot('gauge', trace3, layout);


    });
}



// create a function init to display the data
function init() {
    let selector = d3.select("#selDataset")
    d3.json(url).then((data) => {
        let names = data.names
        names.forEach((sample) => {
            selector.append("option").text(sample).property("value", sample)

        })
        let firstSample = names[0]
        demo_data(firstSample)
        plot_data(firstSample)
        plot_gauge(firstSample)

    })
}
init()

// create a function to update base on optionChanged event
function optionChanged(newSample) {
    demo_data(newSample)
    plot_data(newSample)
    plot_gauge(newSample)
}
