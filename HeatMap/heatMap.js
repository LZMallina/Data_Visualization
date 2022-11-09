//define variables needed to do the project

let URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

let req = new XMLHttpRequest();

let baseTemp //the base temp in the data
let dataset = []; //the array that contains the monthly variants
let minYear
let maxYear

let xScale
let yScale

const w = 1300;
const h = 600;
const padding = 120;

const svg = d3.select('svg')

//draw the svg graph and make it dynamic
const drawCanvas = () => {
    svg.attr('width', w)
        .attr('height', h)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .attr('viewBox', '0 0 1300 600')
        .classed('container', true)
}

//generate the scales needed for x and y values andd xAxis and y-Axis
const generateScales = () => {

    minYear = d3.min(dataset, (d) => {
    return d['year']
    })  

    maxYear = d3.max(dataset, (d) => {
        return d['year']
    })
    xScale = d3.scaleLinear()
        .domain([minYear, maxYear + 1])
        .range([padding, w - padding])
    
    yScale = d3.scaleTime()
        .domain([new Date(0,0,0,0,0,0,0) , new Date (0,12,0,0,0,0,0)])
        .range([padding, h - padding])
    
}

//draw the heat graph
const drawGraph = () => {

    const tooltip = d3.select('.visHolder')
            .append('div')
            .attr('id', 'tooltip')
            .style('opacity', 0);

    svg.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('class', 'cell')
        .attr('fill', (d) => {
            variance = d['variance']
            if (variance <= -1) {
                return 'SteelBlue'
            } else if (variance <= 0) {
                return "LightSteelBlue"
            } else if (variance <= 1) {
                return "Orange"
            } else {
                return "Crimson"
            }
        })
        .attr('data-year', (d) => {
            return d['year']
        })
        .attr('data-month', (d) => {
            return d['month'] - 1 //need to subtract 1 because javascript count from 0 rather than 1
        })
        .attr('data-temp', (d) => {
            return baseTemp + d['variance']
        })
        .attr('height', (h - (2 * padding)) / 12)
        .attr('y', (d) => {
            return yScale(new Date(0, d['month'] - 1, 0, 0, 0, 0, 0))
        })
        .attr('width', (d) => {
            let numberOfYears = maxYear - minYear;
            return ((w - (2 * padding)) / numberOfYears)
        })
        .attr('x', (d) => {
            return xScale(d['year'])
        })
        .on('mouseover', (d) => {
            tooltip.transition()
                .duration(200)
                .style('opacity', 0.9)
       
            let monthName = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            
            tooltip.html(
                
                d['year']+' '+ monthName[d['month']-1]+'<br />'+((baseTemp+d['variance']).toFixed(2))+'&#8451'+'<br />'+ (d['variance']).toFixed(2)
            )
                .style('left', d3.event.pageX + 'px')
                .style('top', d3.event.pageY + 'px')
    
        })
        .on('mouseout', (d) => {
            tooltip.transition()
                .duration(200)
                .style('opacity', 0)
        });
}

//draw the axis, labels, and legend
const drawAxes = () => {

    const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format('d'))//covert string to digit
    svg.append('g')
        .attr('id', 'x-axis')
        .attr("transform", "translate(0, " + (h - padding) + ")")
        .call(xAxis);
    
    const yAxis = d3.axisLeft(yScale)
    .tickFormat(d3.timeFormat('%B'))//%B is d3 format for full month display
    svg.append('g')
        .attr('id', 'y-axis')//this is for passing freeCode camp
        .attr("transform", "translate(" + (padding) + ",0)")
        .call(yAxis);
    
//x-axis label
    const xLabel = svg.attr('id', 'x-label')
    xLabel.append('text')
        .attr('x', w/2)
        .attr('y', 540)
        .text("Year")
    .style('font-size','20')

//making the legend
    let color = ['Steelblue', "LightSteelBlue", "Orange", "Crimson"]
    let yspace = 10; let xspace = -30;//this allows me to adjust position easily
    
    const legend = svg.attr('id','legend')
        legend.selectAll('#legend')
        .data(color)
        .enter()
        .append('rect')
            .attr('x', (d, i) => {
            return ((i*31)+(1000-xspace))
        })
        .attr('y', 570-yspace)
            .attr('width',30)
        .attr('height', 30)
        .style('fill', (color) => {
            return color
        })
        .style('stroke', 'black')
    
    legend.append('text')
        .attr('x', 985-xspace)
        .attr('y', 610-yspace)
        .text('_____________________________')
    legend.append('text')
        .attr('x', 1010-xspace)
        .attr('y', 630-yspace)
        .text('-1 0 1')
    .attr('word-spacing','35')
}

//gather the data and rander it with XMLHttp
req.open('GET', URL, true)
req.onload = function () {
    let data = JSON.parse(req.responseText);
    baseTemp = data.baseTemperature
    dataset = data.monthlyVariance

    console.log(dataset)
    drawCanvas()
    generateScales()
    drawGraph()
    drawAxes() 
}
req.send();