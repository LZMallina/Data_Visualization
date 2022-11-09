//define variables for the project

let edurl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
let countyurl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

let req = new XMLHttpRequest();

let eduData
let countyData

const body = d3.select('body')
const svg = d3.select('svg')

//draw the map
const drawMap = () => {

    const tooltip = d3.select('.visHolder')
            .append('div')
            .attr('id', 'tooltip')
            .style('opacity', 0);

    svg.selectAll('path')//svg <path> element is used to make complex shapes like arcs and lines
        .data(countyData)
        .enter()
        .append('path')
        .attr('d', d3.geoPath())//d3.geoPath converts 'd'(shapes) according to geojson
        .attr('class', 'county')
        .attr('fill', (countyDataitem) => {
            let id = countyDataitem['id']; //in topojson, the county is identified by id and county education data is identified by 'fips'. Here, we are linking id to fips
            let county = eduData.find((item) => {
                return item['fips'] === id
            })
            let percentage = county['bachelorsOrHigher']
            if (percentage <= 3) {
                return "Lavender"
            } else if (percentage <= 12) {
                return 'Plum'
            } else if (percentage <= 24) {
                return 'Violet'
            } else if (percentage <= 48) {
                return 'MediumPurple'
            } else {
                return 'Indigo'
            } 
        })
        .attr('data-fips', (countyDataitem) => {
            return countyDataitem['id']
        })
        .attr('data-education',
        (countyDataitem) => {
            let id = countyDataitem['id'];
            let county = eduData.find((item) => {
                return item['fips'] === id
            })
            let percentage = county['bachelorsOrHigher']
            return percentage
            })
        .on('mouseover', (countyDataitem) => {

            let id = countyDataitem['id'];
            let county = eduData.find((item) => {
                return item['fips'] === id
            })

            tooltip.transition()
                .duration(200)
                .style('opacity', 0.9)
            
            tooltip
                .html(
                    county['area_name']+', '+county['state']+': '+county['bachelorsOrHigher']+'%'
            )
            .style('left', d3.event.pageX + 'px')
            .style('top', d3.event.pageY + 'px')
        })
    .on('mouseout', (d) => {
            tooltip.transition()
                .duration(200)
                .style('opacity', 0)
    });
    
//create legend
    const color = ['Lavender', 'Plum', 'Violet', 'MediumPurple', 'Indigo']
    let x = 0, y = 0; //easier for me to manipulate space
    const legend = svg.attr('id', 'legend')
    legend.selectAll('#legend')
        .data(color)
        .enter()
    .append('rect')
        .attr('x', (color, i) => {
        return ((i*31)+(700))
        })
        .attr('y', 60)
        .attr('width', 30)
        .attr('height', 5)
        .style('fill', (color) => {
        return color
        })
        .style('stroke', 'black')
    
    legend.append('text')
        .attr('x', 698)
        .attr('y', 70)
        .text('||||||')
    .attr('letter-spacing','27')
    
    legend.append('text')
        .attr('x', 698)
        .attr('y', 90)
        .text('0% 3% 12% 24% 48% 60%')
        .attr('word-spacing', '10')
    .style('font-size','11')
}

//pull the data and render it.  d3.json is a promise.  Thereby, function is written with an error message
d3.json(countyurl, function (error, data) {
    if (error) {
        console.log(error);
    } else {
        countyData = topojson.feature(data,data.objects.counties).features//in order to draw each county, need to convert topojson to geojson with its latitude and longitude using the feature method.
        console.log(countyData)
        d3.json(edurl, function (error, data) {
            if (error) {
                console.log(error);
            } else {
                eduData = data;
                console.log(eduData)
                drawMap()
            }
        })
    }
})
