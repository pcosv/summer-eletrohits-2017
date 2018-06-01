/**
 * Class that represents a Chart.
 */
 class Chart {
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
	 * @param {string} tagClass - The type of chart.
	 */
	constructor(container, id, position, margins, dimensions, tagClass) {
		this._container = container;
		
		this._id = id;
		
		if ((position == null) || (typeof(position) != "object")) {
			this._x = 0;
			this._y = 0;
		} else {
			this._x = position.x;
			this._y = position.y;
		}
		
		if (margins == null) {
			this._margins = {left:10, right:10, top:10, bottom:10};
		} else if (typeof(margins) == "number") {
			this._margins = {left:margins, right:margins, top:margins, bottom:margins};
		} else {
			this._margins = margins;
		}
		this._margins.left += this._x;
		this._margins.top += this._y;
		
		if (dimensions == null) {
			this._width = container.attr("width") - this._margins.left - this._margins.right + this._x;
			this._height = container.attr("height") - this._margins.top - this._margins.bottom + this._y;
		} else {
			this._width = dimensions.width - this._margins.left - this._margins.right;
			this._height = dimensions.height - this._margins.top - this._margins.bottom;
		}
		
		this._selection = this._container.append("g")
			.attr("id", this._id)
			.attr("class", tagClass)
			.attr("transform", "translate(" + this._margins.left + "," + this._margins.top + ")");
	}
	
	/**
	 * Returns a selection of the tag containing this chart.
	 * @returns {d3.selection} The container of this chart.
	 */
	container() {
		return this._container;
	}
	
	/**
	 * If a value is given, sets the id, otherwise returns this chart's id.
	 * @param {string} id - The new id of the chart.
	 * @returns {(Chart|string)} This object or the current id.
	 */
	id(id) {
		if (id) {
			this._id = id;
			this._selection.attr("id", id);
			return this;
		} else {
			return this._id;
		}
	}
	
	/**
	 * Returns the coordinates of the origin of the chart.
	 * @returns {number[]} The chart's coordinates.
	 */
	position() {
		return [this._x, this._y];
	}
	
	/**
	 * Returns the margins of the chart.
	 * @returns {Object} The margins of the chart.
	 */
	margins() {
		return this._margins;
	}
		
	/**
	 * The inside width of the margin.
	 * @returns {number} The width of the chart.
	 */
	width() {
		return this._width;
	}
	
	/**
	 * The inside height of the margin.
	 * @returns {number} The height of the chart.
	 */
	height() {
		return this._height;
	}
	
	/**
	 * Returns the selection of the tag of the chart.
	 * @returns {d3.selection} The selection of this chart.
	 */
	selection() {
		return this._selection;
	}
	
	/** 
	 * Generates an array with equally distanced values.
	 * @param {number} start - The first value of the returned array.
	 * @param {number} size - The size of the returned array.
	 * @param {number} end - The last value of the returned array.
	 * @returns {number[]} Array with equally distanced values.
	 */
	static genSequence(start, size, end) {
		var output = [];
		size--;
		for (var i = 0; i <= size; i++) {
			output.push(start + i * (end - start) / size);
		}
		return output;
	}
	
	/**
	 * Adjusts the domain of a scale and its axis.
	 * @param {d3.scale} scale - The scale to be adjusted.
	 * @param {d3.axis} axis - The axis which uses the scale.
	 * @param {d3.selection} axisGroup - The group in which the axis is.
	 * @param {number} minValue - The minimum value of the new domain.
	 * @param {number} maxValue - The maximum value of the new domain.
	 */
	static adjustScaleDomain(scale, axis, axisGroup, minValue, maxValue) {
		scale.domain([minValue, maxValue]);
		axis.scale(scale);
		axisGroup.call(axis);
	}
	
	/** 
	 * Adds a value to a field if it's null.
	 * @param {Object} array - The array which will have a value added.
	 * @param {(number|string)} field - The name of the field.
	 * @param {(function|number|string)} value - The value added.
	 */
	static addIfNull(array, field, value) {
		if (array[field] == null) array[field] = value;
	}
	
	/**
	 * Sets attributes and events of a selection.
	 * @param {d3.selection} selection - The selection of elements used.
	 * @param {Object} attributes - An object containing functions or constants for attributes of the selected elements.
	 * @param {Object} onEvents - An object containing functions for events.
	 */
	static insertAttributesEvents(selection, attributes, onEvents) {
		//Setting attributes
		for (var attrName in attributes) {
			selection.attr(attrName, attributes[attrName]);
		}
		
		//Setting events
		for (var eventName in onEvents) {
			selection.on(eventName, onEvents[eventName]);
		}
	}
}