//data request variables
let URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

let req = new XMLHttpRequest();

//variables for storing the data
let dataset
let dataValues

//variables for height and width of bars
let yScale
let xScale

//variables for xAxis and yAxis
let xAxisScale
let yAxisScale

const w = 900;
const h = 600;
const padding = 40;
const barWidth = w / 275;

const svg = d3.select('svg')

//define functions to draw the graph and make it dynamic
const svgCanvas = () => {
    svg.attr('width', w)
        .attr('height', h)
        .attr("id", "title")
        .attr('preserveAspectRatio', "xMidYMid meet")
        .attr('viewBox', "0 0 900 600 ")
        .classed('container', true);
}

const generateScales = () => {

    yScale = d3.scaleLinear()
        .domain([0, d3.max(dataValues, (d) => d[1])])
        .range([0, h - (2 * padding)]);
    
    xScale = d3.scaleLinear()//scale to index of the data
        .domain([0, dataValues.length-1])
        .range([padding, w - padding]);

//dates provided by freeCodeCamp is in the format of a string.  Below is code to covert it into data that can be organized numerically
    let yearArray = dataValues.map((d) => {
        return new Date(d[0]);
    })
    
    xAxisScale = d3
        .scaleTime()
        .domain([d3.min(yearArray), d3.max(yearArray)])
        .range([padding, w - padding]);    

    yAxisScale = d3.scaleLinear()
        .domain([0, d3.max(dataValues, (d) => d[1])])
        .range([h - padding, padding])

}

const drawBars = () => {

    let overlay = d3.select('visHolder')
        .append('div')
        .attr('class', 'overlay')
        .style('opacity', 0);
    
    const tooltip = d3.select('.visHolder')
        .append('div')
        .attr('id', 'tooltip')
        .style('opacity', 0);
    
    //organize the months as quarters for display on overlay
    let GDP = dataValues.map((d) => d[1])
    
    let monthArray = dataValues.map((d) => {
        let quarter;
        let temp = d[0].substring(5, 7);

        if (temp === '01') {
            quarter = 'Q1';
        } else if (temp === '04') {
            quarter = 'Q2';
        } else if (temp === '07') {
            quarter = "Q3";
        } else if (temp === '10') {
            quarter = 'Q4'
        }
        return d[0].substring(0, 4) + ' ' + quarter;
    })
    
    //draw the graph
    svg.selectAll('rect')
        .data(dataValues)
        .enter()
        .append('rect')
        .attr('class', 'bar')//this is just pass the freeCodeCamp test
        .attr('width', (w - (2 * padding)) / dataValues.length)
        .attr('data-date', (d) => d[0])
        .attr('data-gdp', (d) => d[1])
        .attr('height', (d) => {
            return yScale(d[1])
        })
        .attr('x', (d, i) => {
            return xScale(i)
        })
        .attr('y', (d, i) => {
            return (h - padding) - yScale(d[1])
        })
        .attr('fill', 'purple')
        .on('mouseover', (d,i) => {
            overlay
                .transition()
                .duration(0)
                .style('width', barWidth + 'px')
                .style('opacity', 0.9)
                .style('left', i * barWidth + 0 + 'px')
                .style('top', h - d + 'px')
                .style('transform', 'translateX(60px)');
            
            tooltip.transition().duration(200).style('opacity', 0.9);

            tooltip
                .html(
                    monthArray[i] +
                    '<br>' +
                    '$' +
                    GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') +
                    ' Billion'
                )
                .attr('data-date', dataValues[i][0])
                .style('left', i * barWidth + 30 + 'px')
                .style('top', h - 100 + 'px')
                .style('transform', 'translateX(60px)')            
        })
    .on('mouseout', function () {
          tooltip.transition().duration(200).style('opacity', 0);
          overlay.transition().duration(200).style('opacity', 0);
    })
      
}

const drawAxes = () => {
    
    const xAxis = d3.axisBottom(xAxisScale);

    svg.append('g')
        .attr('id', 'x-axis')//this is just to pass the freeCode camp requirement
        .attr("transform", "translate(0, " + (h - padding) + ")")
        .call(xAxis);
        
    const yAxis = d3.axisLeft(yAxisScale);
    svg.append('g')
        .attr('id', 'y-axis')//this is for passing freeCode camp
        .attr("transform", "translate(" + (padding) + ",0)")
        .call(yAxis);
    
    //Y-axis label
    svg.append("text")
        .attr('x', -350)
        .attr('y', -25)
        .attr("transform",'rotate(-90)')
        .text('Gross Domestic Product($)')
    //X-axis label
    svg.append('text')
        .attr('x', 400)
        .attr('y', 595)
    .text('Time(year)')

}

//request Data
req.open('GET', URL, true);
req.onload = function () {//XMLHttp.onload allow display of function and data immediately the page refresh.
    dataset = JSON.parse(req.responseText);
    dataValues = dataset.data;
    svgCanvas();
    generateScales();
    drawBars();
    drawAxes();
}
req.send();



