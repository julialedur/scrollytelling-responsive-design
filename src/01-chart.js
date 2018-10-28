import * as d3 from 'd3'

const margin = {
  top: 70,
  right: 20,
  bottom: 30,
  left: 50
}

const width = 700 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

const svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3.scaleBand().range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 85])
  .range([height, 0])

const colorScale = d3
  .scaleOrdinal()
  .range([
    '#8dd3c7',
    '#ffffb3',
    '#bebada',
    '#fb8072',
    '#80b1d3',
    '#fdb462',
    '#b3de69'
  ])

d3.csv(require('./data/countries.csv')).then(ready)

function ready(datapoints) {
  // Sort the countries from low to high
  datapoints = datapoints.sort((a, b) => {
    return a.life_expectancy - b.life_expectancy
  })

  // And set up the domain of the xPositionScale
  // using the read-in data
  const countries = datapoints.map(d => d.country)
  xPositionScale.domain(countries)

  /* Add your rectangles here */

  d3.select('#asia').on('stepin', () => {
    svg.selectAll('rect').attr('fill', 'lightgrey')
    svg.selectAll('.asia').attr('fill', '#4cc1fc')
  })

  d3.select('#africa').on('stepin', () => {
    svg.selectAll('rect').attr('fill', 'lightgrey')
    svg.selectAll('.africa').attr('fill', '#4cc1fc')
  })

  d3.select('#na').on('stepin', () => {
    svg.selectAll('rect').attr('fill', 'lightgrey')
    svg.selectAll('.namerica').attr('fill', '#4cc1fc')
  })

  d3.select('#low-gdp').on('stepin', () => {
    svg.selectAll('rect').attr('fill', d => {
      if (d.gdp_per_capita < 3000) {
        return '#4cc1fc'
      } else {
        return 'lightgrey'
      }
    })
  })

  d3.select('#continent').on('stepin', () => {
    svg.selectAll('rect').attr('fill', d => {
      return colorScale(d.continent)
    })
  })

  d3.select('#reset').on('stepin', () => {
    svg.selectAll('rect').attr('fill', 'lightgrey')
  })

  svg
    .selectAll('rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('width', xPositionScale.bandwidth())
    .attr('height', d => {
      return height - yPositionScale(d.life_expectancy)
    })
    .attr('x', d => {
      return xPositionScale(d.country)
    })
    .attr('y', d => {
      return yPositionScale(d.life_expectancy)
    })
    .attr('fill', 'lightgrey')
    .attr('class', d => {
      return d.continent.toLowerCase().replace(/[^a-z]*/g, '')
    })

  svg
    .append('text')
    .text('higher GDP ⟶')
    .attr('class', 'gdp-note-higher')
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('x', width * 0.75)
    .attr('y', height + 15)

  svg
    .append('text')
    .text('⟵ lower GDP')
    .attr('class', 'gdp-note-lower')
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('x', width * 0.25)
    .attr('y', height + 15)

  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickSize(-width)
    .ticks(5)
    .tickFormat(d => (d === 80 ? '80 years' : d))

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .lower()

  d3.select('.y-axis .domain').remove()

  function render() {
    //console.log('Something happened')
    let screenWidth = svg.node().parentNode.parentNode.offsetWidth
    let screenHeight = (height / width) * screenWidth
    let newWidth = screenWidth - margin.left - margin.right
    let newHeight = screenHeight - margin.top - margin.bottom

    // Update your SVG
    let actualSvg = d3.select(svg.node().parentNode)
    actualSvg
      .attr('height', newHeight + margin.top + margin.bottom)
      .attr('width', newWidth + margin.left + margin.right)

    xPositionScale.range([0, newWidth])
    yPositionScale.range([newHeight, 0])

    svg
      .selectAll('rect')
      .attr('width', xPositionScale.bandwidth())
      .attr('height', d => {
        return newHeight - yPositionScale(d.life_expectancy)
      })
      .attr('x', d => {
        return xPositionScale(d.country)
      })
      .attr('y', d => {
        return yPositionScale(d.life_expectancy)
      })

    svg
      .select('.gdp-note-higher')
      .attr('text-anchor', 'middle')
      .attr('font-size', 10)
      .attr('x', newWidth * 0.75)
      .attr('y', newHeight + 15)

    svg
      .select('.gdp-note-lower')
      .attr('text-anchor', 'middle')
      .attr('font-size', 10)
      .attr('x', newWidth * 0.25)
      .attr('y', newHeight + 15)

    yAxis.tickSize(-newWidth)

    svg.select('.y-axis').call(yAxis)
    svg.select('.y-axis .domain').remove()
  }

  // Every time the window resizes, run the render function
  window.addEventListener('resize', render)
  render()
}
