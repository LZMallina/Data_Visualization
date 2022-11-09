//declar variables

let movieURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'

let req = new XMLHttpRequest();

let movieData
let w = 1000; let h = 600;

const svg = d3.select('svg');
//draw the canvas
const drawCanvas = () => {
    svg.attr('width', w)
        .attr('height', h)
}

//draw graph(data is organized in an object array parents and children tree).  Tree diagram refers to the way data is stored rather than the presentation.

const drawTree = () => {

//create the treemap using the treemap method
    const treemap = d3.treemap()
        .size([w, h])
        .padding(1)
//build the roots of the tree
    const root = d3.hierarchy(movieData, (d) => {
        return d.children  //data is stored under 'children'
    })
        .sum(d => d.value)
        .sort((d1, d2) => {  //sort() arrange the values from higher to lower so it will always be a positive value
        return d2.value -d1.value
    })
    
    treemap(root);
//create the cells of the tree
    const cell = svg.selectAll('g')
        .data(root.leaves())
        .enter()
        .append('g')
        .attr('class','group')
        .attr('transform', d => {
            return 'translate(' + d.x0 + ',' + d.y0 + ')';
        });
    
    const tooltip = d3.select('#tooltip')
            .style('opacity', 0);
    
    cell.append('rect')
        .attr('class', 'tile')
        .attr('fill', (d) => {
            let category = d.data.category

            if (category === 'Action') {
                return 'Lavender'
            } else if (category === 'Drama') {
                return 'Salmon'
            } else if (category === 'Family') {
                return 'orange'
            } else if (category === 'Animation') {
                return 'Lime'
            } else if (category === 'Comedy') {
                return 'LightSteelBlue'
            } else if (category === 'Adventure') {
                return 'Wheat'
            } else if (category === 'Biography'){
                return 'yellow'
            }
        })
        .attr('data-name', (d) => {
        return d.data.name
        })
        .attr('data-category', (d) => {
        return d.data.category
        })
        .attr('data-value', (d) => {
        return d.data.value
        })
        .attr('width', (d) => {
            return d.x1 -d.x0
        })
        .attr('height', (d) => {
        return d.y1-d.y0
        })
        .on('mouseover', (d) => {
            tooltip.transition()
                    .duration(200)
                    .style('opacity',0.9)
                
            tooltip.html(
                    '$ '+ d.data.value +'<hr />'+d.data.name
            )
                .style('left', d3.event.pageX + 'px')
                .style('top', d3.event.pageY + 'px');
            
             tooltip.attr('data-value', d.data.value)
        })
        .on('mouseout', (d) => {
           tooltip.transition().duration(200).style('opacity', 0);
        })
    
    cell
    .append('text')
    .attr('class', 'tile-text')
    .selectAll('tspan')
    .data((d)=> {
      return d.data.name.split(/(?=[A-Z][^A-Z])/g);
    })
    .enter()
    .append('tspan')// <tspan> allow d3 to add line breaks so the name would not appear in one single line.
    .attr('x', 4)
    .attr('y', (d, i)=> {
      return 10 + i * 10;
    })
    .text((d)=> {
      return d;
    });
}

//extract the data from the 3 links then render it
req.open('GET', movieURL, true);
req.onload = function () {
    movieData = JSON.parse(req.responseText);
    console.log(movieData)
    drawCanvas()
    drawTree();
}
req.send();