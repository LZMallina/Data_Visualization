//define variables that we will need

const w = 800;
const h = 600;
const padding = 40;

//1)Use d3 to fecth the data will render the data within the function

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json',
    function (error, data) {
        console.log(data)

//set the SVG canvas area and tooltips display

        const svg = d3.select('svg')
            .attr('width', w)
            .attr('height', h)
            .attr('preserveAspectRatio', "xMidYMid meet")
            .attr('viewBox', "0 0 900 600 ")
            .classed('container', true);
        
        const tooltip = d3.select('.visHolder')
            .append('div')
            .attr('id', 'tooltip')
            .style('opacity', 0);
        
//generate scales that are needed for x and y -axis and scatter points
        const xScale = d3.scaleLinear()
            .domain([d3.min(data, (d)=> d['Year']-1), d3.max(data,(d)=>d['Year'])+1])
            .range([padding, w - padding])
    
        const yScale = d3.scaleTime()
            .domain([
                d3.min(data, (d) => {
                    return new Date(d['Seconds'] *998)
                }),
                d3.max(data, (d) => {
                    return new Date(d['Seconds']*1002)
                })
            ])
            .range([padding, h - padding])
        
//draw the points on the plot
        svg.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('r', 6)
            .attr('data-xvalue', (d) => { return d['Year'] })
            .attr('data-yvalue', (d) => { return new Date(d['Seconds'] * 1000) })
            .attr('cx', (d) => { return xScale(d["Year"]) })
            .attr('cy', (d) => { return yScale(new Date(d['Seconds'] * 1000)) })
            .attr('fill', (d) => {
                if (d['Doping'] != '') {
                return "orange"
                } else {
                    return 'green'
            }
            })
            .style("stroke", "#000")
            .style('opacity',0.8)
            .on('mouseover', (d) => {
                 tooltip
                    .transition()
                    .duration(200)
                    .style('opacity', 0.9);
                
                tooltip.html(
                    d.Name + ":" + d.Nationality + '<br />' + "Year:" + d.Year + ', Time: ' + d.Time + 
                    (d.Doping?'<br />'+d.Doping:'')
                )
                    .style('left', d3.event.pageX + 'px')
                    .style('top', d3.event.pageY + 'px');
            })

          .on('mouseout', (d)=> {
          tooltip.transition().duration(200).style('opacity', 0);
    })
               
//generate the x & y axis
        const xAxis = d3.axisBottom(xScale)
             .tickFormat(d3.format('d')) //a d3 format to turn string into digit (represented by 'd')
        svg.append('g')
            .attr('id', 'x-axis')//this is just to pass the freeCode camp requirement
            .attr("transform", "translate(0, " + (h - padding) + ")")
            .call(xAxis);
        
        const yAxis = d3.axisLeft(yScale)
            .tickFormat(d3.timeFormat('%M:%S'))
        svg.append('g')
            .attr('id', 'y-axis')//this is for passing freeCode camp
            .attr("transform", "translate(" + (padding) + ",0)")
            .call(yAxis);
        
    //Y-axis label
         svg.append("text")
            .attr('x', -300)
            .attr('y', 60)
            .attr("transform",'rotate(-90)')
            .text('Minutes')
        
    //X-axis label
        svg.append('text')
           .attr('x', 400)
           .attr('y', 595)
           .text('Year')
        
    //legend label
        const legend = svg.attr('id', 'legend')//just to pass free code camp requirement
        
        legend.append('rect')
            .attr('x', 500)
            .attr('y', 200)
            .attr('width', 18)
            .attr('height',18)
            .style("fill", "orange")
        .style("stroke",'black')
         legend.append('rect')
            .attr('x', 500)
            .attr('y', 240)
            .attr('width', 18)
            .attr('height',18)
            .style("fill", "green")
            .style('stroke', 'black')
        legend.append('text')
            .attr('x', 530)
            .attr('y', 215)
            .text("With dopping allegation")
        
        legend.append('text')
            .attr('x', 530)
            .attr('y', 255)
        .text('No dopping allegation')
                  
})