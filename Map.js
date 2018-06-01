/**
 * Class that represents a Map chart.
 * @extends Chart
 */
class Map extends Chart {
	/**
	 * @constructor
	 * @param {d3.selection} container - The tag in which the chart will be inserted.
	 * @param {string} id - The id of the chart tag.
	 * @param {Object} position - The position of the chart.
	 * @param {number} position.x - The X coordinate of the chart.
	 * @param {number} position.y - The Y coordinate of the chart.
	 * @param {(number|Object)} margins - The margins of the chart. If a number is passed, all its values will be the same.
	 * @param {number} margins.left - Left margin of the chart.
	 * @param {number} margins.right - Right margin of the chart.
	 * @param {number} margins.top - Upper margin of the chart.
	 * @param {number} margins.bottom - Lower margin of the chart.
	 * @param {Object} dimensions - The dimensions of the chart.
	 * @param {number} dimensions.width - The width of the chart, counting the margins.
	 * @param {number} dimensions.height - The height of the chart, counting the margins.
	 */
	constructor(container, id, position, margins, dimensions) {
		super(container, id, position, margins, dimensions, "mapChart");
		
		this._projection = d3.geoMercator();
		this._geoPath = d3.geoPath().projection(this._projection);
		
		this._fillValue = (d, i)=>1;
		
		this._colorScale = d3.scalePow();
		
		this._colorScheme = d3.interpolateInferno;
		
		this._fillFunction = (d, i)=>this._colorScheme(this._colorScale(this._fillValue(d, i)));
		
		this._pathSelection = null;
		
		this._dotSelection = null;
	}
	
	/**
	 * Returns the selection of the paths of the chart.
	 * @returns {d3.selection} The paths of this chart.
	 */
	pathSelection() {
		return this._pathSelection;
	}
	
	/**
	 * Returns the selection of the dots of the chart.
	 * @returns {d3.selection} The dots of this chart.
	 */
	dotSelection() {
		return this._dotSelection;
	}
	
	/**
	 * If a projection is given, sets the projection of the map, otherwise returns the current projection.
	 * @param {Object} projection - The new projection of the map.
	 * @returns {(Map|d3.projection)} This object or the current projection.
	 */
	projection(projection) {
		if (projection) {
			this._projection = projection;
			this._geoPath = d3.geoPath().projection(this._projection);
			return this;
		} else {
			return this._projection;
		}
	}
	
	/**
	 * The function which determines the value of the dataset to be used on the fillFunction. Default function always returns 1. If a function is given, sets fillValue, otherwise returns the current fillValue.
	 * @param {function} func - The new fillValue.
	 * @returns {(Map|function)} This object or the current fillValue.
	 */
	fillValue(func) {
		if (func) {
			this._fillValue = func;
			return this;
		} else {
			return this._fillValue;
		}
	}
	
	/**
	 * The scale between input values and the value used at colorScheme. Its range should stay at [0, 1]. If a scale is given sets the colorScale, otherwise returns the current projection.
	 * @param {d3.scale} scale - The new colorScale.
	 * @returns {(Map|d3.projection)} This object or the current colorScale.
	 */
	colorScale(scale) {
		if (scale) {
			this._colorScale = scale;
			return this;
		} else {
			return this._colorScale;
		}
	}
	
	/**
	 * The color scheme used at the chart. Uses d3.interpolateInferno by default. If a scale is given sets the colorScheme, otherwise returns the current colorScheme.
	 * @param {d3.scale} scheme - The new colorScheme.
	 * @returns {(Map|d3.scale)} This object or the current colorScheme.
	 */
	colorScheme(scheme) {
		if (scheme) {
			this._colorScheme = scheme;
			return this;
		} else {
			return this._colorScheme;
		}
	}
	
	/**
	 * The function which sets the colors of the map. If a function is given, sets fillFunction. Setting func to null will reset fillFunction to its default value: (d, i)=>this._colorScheme(this._colorScale(this._fillValue(d, i))). Not passing a value makes it return the current fillFunction.
	 * @param {function} func - The new fillFunction.
	 * @returns {(Map|function)} This object or the current fillFunction.
	 */
	fillFunction(func) {
		if (func) {
			this._fillFunction = func;
			return this;
		} else if (func === null) {
			this._fillFunction = (d, i)=>this._colorScheme(this._colorScale(this._fillValue(d, i)));
			return this;
		} else {
			return this._fillFunction;
		}
	}
	
	/** 
	 * Plots the geojson on the chart as paths.
	 * @param {Object} geojson - The data of a geojson file.
	 * @param {Object} attributes - An object containing functions or constants for attributes of the map.
	 * @param {Object} onEvents - An object containing functions for events.
	 */
	setMap(geojson, attributes, onEvents) {
		var thisChart = this;
		
		//Scales the projection to centralize the map
		this._projection.fitExtent([[0, 0], [this._width, this._height]], geojson);
		
		//Mandatory attributes
		if (attributes == null) attributes = [];
		Chart.addIfNull(attributes, "id", (d, i)=>d.properties.L1);
		attributes["class"] = "mapPath";
		Chart.addIfNull(attributes, "d", (d, i)=>thisChart._geoPath(d.geometry));
		
		this._pathSelection = this._selection.selectAll(".mapPath").data(geojson.features).enter().append("path")
			.attr("fill", (d, i)=>thisChart._fillFunction(d, i));
		
		//Insertion of attributes and events
		Chart.insertAttributesEvents(this._pathSelection, attributes, onEvents);
	}
	
	/** 
	 * Plots the dataset on the map chart.
	 * @param {number[][]} dataset - The data to be plotted on the map.
	 * @param {Object} attributes - An object containing functions or constants for attributes of the map.
	 * @param {Object} onEvents - An object containing functions for events.
	 */
	setData(dataset, attributes, onEvents) {
		var thisChart = this;
		
		this._pathSelection.data(dataset)
			.attr("fill", (d, i)=>thisChart._fillFunction(d, i));
		
		//Insertion of attributes and events
		Chart.insertAttributesEvents(this._pathSelection, attributes, onEvents);
	}
	
	/** 
	 * Plots data as dots on the map chart.
	 * @param {number[][]} dataset - The data to be plotted on the map.
	 * @param {Object} attributes - An object containing functions or constants for attributes of the map.
	 * @param {Object} onEvents - An object containing functions for events.
	 */
	setDots(dataset, attributes, onEvents) {
		var thisChart = this;
		
		//Mandatory attributes
		if (attributes == null) attributes = [];
		Chart.addIfNull(attributes, "id", (d, i)=>("dot" + i));
		attributes["class"] = "mapDot";
		Chart.addIfNull(attributes, "r", "3px");
		Chart.addIfNull(attributes, "cx", 10);
		Chart.addIfNull(attributes, "cy", 10);
		
		this._dotSelection = this._selection.selectAll(".mapDot").data(dataset).enter().append("circle")
			.attr("fill", (d, i)=>thisChart._fillFunction(d, i));
		
		//Insertion of attributes and events
		Chart.insertAttributesEvents(this._dotSelection, attributes, onEvents);
	}
	
	/** 
	 * Clears the chart, removing all paths and dots.
	 */
	clear() {
		if (this._pathSelection) {
			this._pathSelection.remove();
			this._pathSelection = null;
		}
		if (this._dotSelection) {
			this._dotSelection.remove();
			this._dotSelection = null;
		}
		if (this.labels) {
			this.labels.tag.remove();
			this.labels = null;
		}
	}
}