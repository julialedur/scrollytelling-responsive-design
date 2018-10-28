import * as d3 from 'd3'

let margin = { top: 100, left: 50, right: 150, bottom: 30 }

let height = 700 - margin.top - margin.bottom

let width = 600 - margin.left - margin.right

let svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let parseTime = d3.timeParse('%B-%y')

let xPositionScale = d3.scaleLinear().range([0, width])
let yPositionScale = d3.scaleLinear().range([height, 0])

let colorScale = d3
  .scaleOrdinal()
  .range([
    '#8dd3c7',
    '#ffffb3',
    '#bebada',
    '#fb8072',
    '#80b1d3',
    '#fdb462',
    '#b3de69',
    '#fccde5',
    '#d9d9d9',
    '#bc80bd'
  ])

let line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.datetime)
  })
  .y(function(d) {
    return yPositionScale(d.price)
  })

d3.csv(require('./data/housing-prices.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  // console.log(datapoints)
  datapoints.forEach(d => {
    d.datetime = parseTime(d.month)
  })
  let dates = datapoints.map(d => d.datetime)
  let prices = datapoints.map(d => +d.price)

  xPositionScale.domain(d3.extent(dates))
  yPositionScale.domain(d3.extent(prices))

  let nested = d3
    .nest()
    .key(function(d) {
      return d.region
    })
    .entries(datapoints)

  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('d', function(d) {
      return line(d.values)
    })
    .attr('stroke', function(d) {
      return colorScale(d.key)
    })
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .attr('class', d => {
      return d.key.toLowerCase().replace(/[a-z]/g, '')
    })
    .classed('highlight-all', true)
    .classed('us', d => {
      // console.log(d)
      if (d.key === 'U.S.') {
        return true
      }
    })
    .classed('region-highlight', d => {
      if (
        d.key === 'Mountain' ||
        d.key === 'Pacific' ||
        d.key === 'West South Central' ||
        d.key === 'South Atlantic'
      ) {
        return true
      }
    })

  svg
    .selectAll('circle')
    .data(nested)
    .enter()
    .append('circle')
    .attr('fill', function(d) {
      return colorScale(d.key)
    })
    .attr('r', 4)
    .attr('cy', function(d) {
      return yPositionScale(d.values[0].price)
    })
    .attr('cx', function(d) {
      return xPositionScale(d.values[0].datetime)
    })
    .attr('class', d => {
      return d.key.toLowerCase().replace(/[a-z]/g, '')
    })
    .classed('highlight-all', true)
    .classed('us', d => {
      // console.log(d)
      if (d.key === 'U.S.') {
        return true
      }
    })
    .classed('region-highlight', d => {
      if (
        d.key === 'Mountain' ||
        d.key === 'Pacific' ||
        d.key === 'West South Central' ||
        d.key === 'South Atlantic'
      ) {
        return true
      }
    })

  svg
    .selectAll('text')
    .data(nested)
    .enter()
    .append('text')
    .attr('y', function(d) {
      return yPositionScale(d.values[0].price)
    })
    .attr('x', function(d) {
      return xPositionScale(d.values[0].datetime)
    })
    .text(function(d) {
      return d.key
    })
    .attr('dx', 6)
    .attr('dy', 4)
    .attr('font-size', '12')
    .attr('class', d => {
      return d.key.toLowerCase().replace(/[a-z]/g, '')
    })
    .classed('highlight-all', true)
    .classed('us', d => {
      // console.log(d)
      if (d.key === 'U.S.') {
        return true
      }
    })
    .classed('region-highlight', d => {
      if (
        d.key === 'Mountain' ||
        d.key === 'Pacific' ||
        d.key === 'West South Central' ||
        d.key === 'South Atlantic'
      ) {
        return true
      }
    })

  svg
    .append('text')
    .attr('font-size', '24')
    .attr('text-anchor', 'middle')
    .attr('class', 'title')
    .text('U.S. housing prices fall in winter')
    .attr('x', width / 2)
    .attr('y', -40)
    .attr('dx', 40)

  let rectWidth =
    xPositionScale(parseTime('February-17')) -
    xPositionScale(parseTime('November-16'))

  svg
    .append('rect')
    .attr('x', xPositionScale(parseTime('December-16')))
    .attr('y', 0)
    .attr('class', 'winter-rect')
    .attr('width', rectWidth)
    .attr('height', height)
    .attr('fill', '#C2DFFF')
    .style('visibility', 'hidden')
    .lower()

  let xAxis = d3
    .axisBottom(xPositionScale)
    .tickFormat(d3.timeFormat('%b %y'))
    .ticks(9)

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  let yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  // Here goes all the steps

  // First: nothing shows up except the axes

  d3.select('#blank-graph').on('stepin', () => {
    svg
      .selectAll('.highlight-all')
      .attr('fill', 'none')
      .attr('stroke', 'none')
  })

  // Second: Everything shows up, except the winter rectangle

  d3.select('#draw-lines').on('stepin', () => {
    svg
      .selectAll('circle.highlight-all')
      .style('visibility', 'visible')
      .attr('fill', function(d) {
        return colorScale(d.key)
      })
      .attr('r', 4)
      .attr('cy', function(d) {
        return yPositionScale(d.values[0].price)
      })
      .attr('cx', function(d) {
        return xPositionScale(d.values[0].datetime)
      })

    svg
      .selectAll('path.highlight-all')
      .transition()
      .attr('stroke', function(d) {
        return colorScale(d.key)
      })

    svg
      .selectAll('text')
      .style('visibility', 'visible')
      .transition()
      .attr('fill', 'black')
  })

  // Third: highlight US lines, circle and text

  d3.select('#highlight-us').on('stepin', () => {
    svg
      .selectAll('path')
      .transition()
      .attr('stroke', 'lightgray')

    svg
      .selectAll('circle')
      .transition()
      .attr('fill', 'lightgray')

    svg
      .selectAll('text.highlight-all')
      .transition()
      .attr('fill', 'lightgray')
      .attr('font-weight', 'bold')

    svg
      .selectAll('circle.us')
      .transition()
      .attr('fill', 'red')
    // .raise()

    svg
      .selectAll('path.us')
      .transition()
      .attr('fill', 'none')
      .attr('stroke', 'red')
    // .raise()

    svg
      .selectAll('text.us')
      .transition()
      .attr('fill', 'red')
      .attr('font-weight', 'bold')
    // .raise()
  })

  // Fourth: highlight the lines per region

  d3.select('#highlight-regions').on('stepin', () => {
    svg
      .selectAll('path')
      .transition()
      .attr('stroke', 'lightgray')

    svg
      .selectAll('circle')
      .transition()
      .attr('fill', 'lightgray')

    svg
      .selectAll('.label-text')
      .transition()
      .attr('fill', 'lightgray')

    svg
      .selectAll('circle.us')
      .transition()
      .attr('fill', 'red')

    svg
      .selectAll('path.us')
      .transition()
      .attr('fill', 'none')
      .attr('stroke', 'red')

    svg
      .selectAll('text.us')
      .transition()
      .attr('fill', 'red')

    svg
      .selectAll('path.region-highlight')
      .transition()
      .attr('stroke', '#B9E3EA')

    svg
      .selectAll('text.region-highlight')
      .transition()
      .attr('fill', '#B9E3EA')

    svg
      .selectAll('circle.region-highlight')
      .transition()
      .attr('fill', '#B9E3EA')
  })

  // Fifth: draw winter rectangle

  d3.select('#draw-rect').on('stepin', () => {
    svg.select('rect').style('visibility', 'visible')
  })

  function render() {
    console.log('Something happened')

    // Calculate height/width
    let screenWidth = svg.node().parentNode.parentNode.offsetWidth
    let screenHeight = window.innerHeight
    let newWidth = screenWidth - margin.left - margin.right
    let newHeight = screenHeight - margin.top - margin.bottom

    // Update your SVG
    let actualSvg = d3.select(svg.node().parentNode)
    actualSvg
      .attr('height', newHeight + margin.top + margin.bottom)
      .attr('width', newWidth + margin.left + margin.right)

    // Update scales (depends on your scales)
    xPositionScale.range([0, newWidth])
    yPositionScale.range([newHeight, 0])

    // Reposition/redraw your elements

    svg.selectAll('path.highlight-all').attr('d', function(d) {
      return line(d.values)
    })

    svg
      .selectAll('circle')
      .attr('cy', function(d) {
        return yPositionScale(d.values[0].price)
      })
      .attr('cx', function(d) {
        return xPositionScale(d.values[0].datetime)
      })

    svg
      .selectAll('text.highlight-all')
      .attr('y', function(d) {
        return yPositionScale(d.values[0].price)
      })
      .attr('x', function(d) {
        return xPositionScale(d.values[0].datetime)
      })
      .attr('font-size', '10')
      .attr('dx', 6)
      .attr('dy', 4)

    svg
      .select('.title')
      .attr('font-size', '20')
      .attr('x', newWidth / 2)
      .attr('y', -40)
      .attr('dx', 40)

    svg
      .select('rect')
      .attr('x', xPositionScale(parseTime('December-16')))
      .attr('width', rectWidth)
      .attr('height', newHeight)

    // Update axes if necessary
    svg
      .select('.x-axis')
      .attr('transform', 'translate(0,' + newHeight + ')')
      .call(xAxis)
    svg.select('.y-axis').call(yAxis)
  }

  window.addEventListener('resize', render)
  render()
}
