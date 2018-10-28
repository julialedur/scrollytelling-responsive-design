import * as d3 from 'd3'
import { debounce } from 'debounce'

var margin = { top: 10, left: 10, right: 10, bottom: 10 }

var height = 480 - margin.top - margin.bottom

var width = 480 - margin.left - margin.right

var svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var radius = 200

var radiusScale = d3
  .scaleLinear()
  .domain([10, 100])
  .range([40, radius])

var allCities = ['NYC', 'Beijing', 'Stockholm', 'Lima', 'Tuscon']

var colorScale = d3
  .scaleOrdinal()
  .range(['#E5FDC0', '#99e6e6', '#957AC1', '#F29482', '#B81D75'])
  .domain(allCities)

var angleScale = d3
  .scalePoint()
  .domain([
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
    'Blah'
  ])
  .range([0, Math.PI * 2])

var line = d3
  .radialArea()
  .outerRadius(function(d) {
    return radiusScale(d.high_temp)
  })
  .innerRadius(function(d) {
    return radiusScale(d.low_temp)
  })
  .angle(function(d) {
    return angleScale(d.month_name)
  })

d3.csv(require('./data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  // console.log(datapoints)

  var container = svg
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

  datapoints.forEach(d => {
    d.high_temp = +d.high_temp
    d.low_temp = +d.low_temp
  })

  let nycData = datapoints.filter(d => d.city === 'NYC')
  nycData.push(nycData[0])

  container
    .append('path')
    .attr('class', 'temp')
    .datum(nycData)
    .attr('d', line)
    .attr('fill', colorScale('NYC'))
    .attr('opacity', 0.75)

  var circleBands = [20, 30, 40, 50, 60, 70, 80, 90]
  var textBands = [30, 50, 70, 90]

  container
    .selectAll('.bands')
    .data(circleBands)
    .enter()
    .append('circle')
    .attr('class', 'bands')
    .attr('fill', 'none')
    .attr('stroke', 'gray')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', function(d) {
      return radiusScale(d)
    })
    .lower()

  container
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('class', 'city-name')
    .text('NYC')
    .attr('font-size', 30)
    .attr('font-weight', 700)
    .attr('alignment-baseline', 'middle')

  container
    .selectAll('.temp-notes')
    .data(textBands)
    .enter()
    .append('text')
    .attr('class', 'temp-notes')
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('dy', -2)
    .text(d => d + '°')
    .attr('text-anchor', 'middle')
    .attr('font-size', 8)

  function displayCity(city) {
    d3.selectAll('.colored-text').style('background-color', 'white')

    let cityDatapoints = datapoints.filter(d => d.city === city)

    cityDatapoints.push(cityDatapoints[0])

    container
      .select('.temp')
      .datum(cityDatapoints)
      .transition()
      .attr('d', line)
      .attr('fill', colorScale(city))

    container.select('.city-name').text(city)

    var labelName = '.label-' + city
    // console.log(labelName)

    d3.selectAll(labelName).style('background-color', colorScale(city))
  }

  // Filter it so I'm only looking at NYC datapoints

  function render() {
    // Calculate height/width
    let screenWidth = svg.node().parentNode.parentNode.offsetWidth
    let screenHeight = window.innerHeight
    let newWidth = screenWidth - margin.left - margin.right
    let newHeight = screenHeight - margin.top - margin.bottom

    let newRadius = newWidth / 2.5
    // Update your SVG
    let actualSvg = d3.select(svg.node().parentNode)
    actualSvg
      .attr('height', newHeight + margin.top + margin.bottom)
      .attr('width', newWidth + margin.left + margin.right)

    // Update scales (depends on your scales)
    radiusScale.range([40, newRadius])

    // Reposition/redraw your elements
    container.attr(
      'transform',
      'translate(' + newWidth / 2 + ',' + newHeight / 2 + ')'
    )

    container.select('.temp').attr('d', line)

    container
      .selectAll('.bands')
      .attr('r', function(d) {
        return radiusScale(d)
      })
      .lower()

    container.select('.city-name').attr('font-size', 30)

    container
      .selectAll('.temp-notes')
      .attr('x', 0)
      .attr('y', d => -radiusScale(d))
  }

  window.addEventListener('resize', debounce(render, 1000))
  render()

  d3.select('#ready-chart-three').on('stepin', () => {
    displayCity('NYC')
  })

  d3.select('#NYC').on('stepin', () => {
    displayCity('NYC')
  })

  d3.select('#Beijing').on('stepin', () => {
    displayCity('Beijing')
  })

  d3.select('#Stockholm').on('stepin', () => {
    displayCity('Stockholm')
  })

  d3.select('#Lima').on('stepin', () => {
    displayCity('Lima')
  })

  d3.select('#Tuscon').on('stepin', () => {
    displayCity('Tuscon')
  })
}
