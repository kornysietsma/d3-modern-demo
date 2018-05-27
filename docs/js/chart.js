import { removeWarning } from './utils.js';
import rawData from './exported-data.js';

removeWarning('old_browser_warning');


const chartConfig = {
    margins: {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40,
    },
    outerWidth: 1024,
    outerHeight: 768,
};

function initialiseChartElements(rootSelector, config) {
    const width = config.outerWidth - config.margins.left - config.margins.right;
    const height = config.outerHeight - config.margins.top - config.margins.bottom;

    const chartEl = d3.select(rootSelector).append('svg')
        .attr('width', config.outerWidth)
        .attr('height', config.outerHeight)
        .append('g');

    const xAxisGroup = chartEl.append('g')
        .attr('class', 'x-axis-group')
        .attr('transform', `translate(0,${(height - config.margins.bottom)})`);

    const yAxisGroup = chartEl.append('g')
        .attr('class', 'y-axis-group')
        .attr('transform', `translate(${config.margins.left},0)`);

    return {
        chartEl,
        xAxisGroup,
        yAxisGroup,
    };
}

function postProcessData(data) {
    // at the moment, just convert dates to unix epoch seconds and make datastructures immutable
    return Immutable.fromJS(data)
        .map(d => d.update('date', date => moment(date, moment.ISO_8601).unix()))
        .sortBy(d => d.get('date'));
}

function updateChart(config, elements, data) {
    const {
        chartEl,
        xAxisGroup,
        yAxisGroup,
    } = elements;

    const width = config.outerWidth - config.margins.left - config.margins.right;
    const height = config.outerHeight - config.margins.top - config.margins.bottom;

    const minDate = data.map(d => d.get('date')).min();
    const maxDate = data.map(d => d.get('date')).max();
    const maxSize = data.map(d => d.get('size')).max();

    const yScale = d3.scaleLinear()
        .domain([0, maxSize])
        .range([height - config.margins.bottom, config.margins.top]);

    const yAxis = d3.axisLeft()
        .scale(yScale);
    // TODO - y scale ticks

    yAxisGroup.call(yAxis);

    const xScale = d3.scaleTime()
        .domain([moment.unix(minDate).toDate(), moment.unix(maxDate).toDate()])
        .range([config.margins.left, width]);

    const xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(d3.timeDay.every(1))
        .tickFormat(d3.timeFormat('%d/%m'));

    xAxisGroup.call(xAxis);

    const lineClass = 'sizeLine';

    const theLine = d3.line()
        .curve(d3.curveMonotoneX)
        .x(d => xScale(moment.unix(d.get('date')).toDate()))
        .y(d => yScale(d.get('size')));

    const line = chartEl.selectAll(`.${lineClass}`).data([data.toArray()]);

    const newLine = line.enter()
        .append('path')
        .attr('class', lineClass)
        .style('fill', 'none');

    line.merge(newLine).attr('d', theLine);

    line.exit().remove();
}

const chartElements = initialiseChartElements('#chart_parent', chartConfig);

const data = postProcessData(rawData);

updateChart(chartConfig, chartElements, data);
