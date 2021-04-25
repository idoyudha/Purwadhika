/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const util = require("util");

const TOMBSTONE = {};
const UNDEFINED_MARKER = {};

class StackedSetMap {
	constructor(parentStack) {
		this.stack = parentStack === undefined ? [] : parentStack.slice();
		this.map = new Map();
		this.stack.push(this.map);
	}

	add(item) {
		this.map.set(item, true);
	}

	set(item, value) {
		this.map.set(item, value === undefined ? UNDEFINED_MARKER : value);
	}

	delete(item) {
		if (this.stack.length > 1) {
			this.map.set(item, TOMBSTONE);
		} else {
			this.map.delete(item);
		}
	}

	has(item) {
		const topValue = this.map.get(item);
		if (topValue !== undefined) return topValue !== TOMBSTONE;
		if (this.stack.length > 1) {
			for (var i = this.stack.length - 2; i >= 0; i--) {
				const value = this.stack[i].get(item);
				if (value !== undefined) {
					this.map.set(item, value);
					return value !== TOMBSTONE;
				}
			}
			this.map.set(item, TOMBSTONE);
		}
		return false;
	}

	get(item) {
		const topValue = this.map.get(item);
		if (topValue !== undefined) {
			return topValue === TOMBSTONE || topValue === UNDEFINED_MARKER
				? undefined
				: topValue;
		}
		if (this.stack.length > 1) {
			for (var i = this.stack.length - 2; i >= 0; i--) {
				const value = this.stack[i].get(item);
				if (value !== undefi