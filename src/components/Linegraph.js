import React, {useState, useEffect} from 'react';
import {Line} from "react-chartjs-2";
import numeral from "numeral";


const options = {
    legend: {
        display: false
    },

    elements: {
        points: {
            radius: 0
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data){
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales:{
        xAxes:[
            {
                type:"time",
                time:{
                    format:"MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines:{
                    display: false,
                },
                ticks: {
                    callback: function(value, index, values){
                        return numeral(value).format("0a")
                    },
                },
            },
        ],
    },
};

const createChartData = (data, casesType) => {
    const chartData = [];
    let lastDataPoint;

    for(let date in data.cases) {
        if(lastDataPoint){
            const newDataPoint = {
                x: date,
                y: data[casesType][date] - lastDataPoint
            }
            chartData.push(newDataPoint);
        }

        lastDataPoint = data[casesType][date];
    }

    return chartData;
}

function LineGraph({ casesType}) {
const [data, setData] = useState({})


useEffect(() => {
    const fetchData = async () => {
        await fetch("https://disease.sh/v3/covid-19/historical/all/?lastdays=120")
        .then(response => response.json())
        .then(data => {
            let chartData = createChartData(data, casesType);
            setData(chartData);
        });
    }

    fetchData();
    
}, [casesType]);
    
    return(
        <div>
            {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204, 16, 52, 0.5)",
                borderColor: "#CC1034",
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
        </div>
    )
}

export default LineGraph
