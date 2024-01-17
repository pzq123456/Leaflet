/*
 * @namespace Util
 *
 * 工具函数，leaflet 内部使用
 */

/**
 * 合并对象 Merges the properties (including properties inherited through the prototype chain)
 * @param {object} dest - 目标对象
 * @param  {...any} args - 可以传入多个对象
 * @returns {object} - 返回合并后的对象
 */
export function extend(dest, ...args) {
	let j, len, src;

	for (j = 0, len = args.length; j < len; j++) {
		src = args[j];
		// eslint-disable-next-line guard-for-in
		for (const i in src) {
			dest[i] = src[i];
		}
	}
	return dest;
}


/**
 * @property lastId: Number
 * - 用于 [`stamp()`](#util-stamp) 函数
 */
export let lastId = 0;

// @function stamp(obj: Object): Number
// Returns the unique ID of an object, assigning it one if it doesn't have it.
export function stamp(obj) {
	if (!('_leaflet_id' in obj)) {
		obj['_leaflet_id'] = ++lastId;
	}
	return obj._leaflet_id;
}

// @function throttle(fn: Function, time: Number, context: Object): Function
// Returns a function which executes function `fn` with the given scope `context`
// (so that the `this` keyword refers to `context` inside `fn`'s code). The function
// `fn` will be called no more than one time per given amount of `time`. The arguments
// received by the bound function will be any arguments passed when binding the
// function, followed by any arguments passed when invoking the bound function.
// Has an `L.throttle` shortcut.
/**
 * 节流函数，返回一个函数，该函数在给定的时间内最多执行一次
 * @param {Function} fn - 需要节流的函数
 * @param {Number} time - 间隔时间
 * @param {Object} context - 函数执行的上下文
 * @returns 
 */
export function throttle(fn, time, context) {
	let lock, queuedArgs;

	function later() {
		// reset lock and call if queued
		lock = false;
		if (queuedArgs) {
			wrapperFn.apply(context, queuedArgs);
			queuedArgs = false;
		}
	}

	function wrapperFn(...args) {
		if (lock) {
			// called too soon, queue to call later
			queuedArgs = args;

		} else {
			// call and lock until later
			fn.apply(context, args); // .apply 就是指定函数执行的上下文和参数
			setTimeout(later, time);
			lock = true;
		}
	}

	return wrapperFn;
}

// @function wrapNum(num: Number, range: Number[], includeMax?: Boolean): Number


/**
 * 将数字 num 模数为 range，使其位于 range[0] 和 range[1] 之间。
 * Returns the number `num` modulo `range` in such a way so it lies within`range[0]` and `range[1]`. 
 * The returned value will be always smaller than `range[1]` unless `includeMax` is set to `true`.
 * @param {Number} x - 需要进行模数的数字
 * @param {Number[]} range - 模数范围
 * @param {Boolean} includeMax - 是否包含最大值
 * @returns {Number} - 返回模数后的数字
 */
export function wrapNum(x, range, includeMax) {
	const max = range[1],
	    min = range[0],
	    d = max - min;
	return x === max && includeMax ? x : ((x - min) % d + d) % d + min;
}


/**
 * 返回一个函数，该函数始终返回 false
 * @returns {Function => false} 
 */
export function falseFn() { return false; }

/**
 * 这个函数的主要目的是将数字 num 四舍五入到指定的 precision 小数位。
 * @param {Number} num 
 * @param {Number} precision - 这是一个可选参数，表示要四舍五入到的小数位数。
 * 	- 如果没有提供这个参数，那么默认值为 6。
 * 	- 如果这个参数为 false，那么函数将直接返回 num，不进行任何处理。
 * @returns {Number} - 返回四舍五入后的数字
 */
export function formatNum(num, precision) {
	if (precision === false) { return num; }
	const pow = Math.pow(10, precision === undefined ? 6 : precision);
	return Math.round(num * pow) / pow;
	// JavaScript 提供了 toFixed 方法可以将数字四舍五入到指定的小数位，但是它返回的是字符串，而不是数字。此外，toFixed 方法不能接受 false 作为参数来跳过处理。
}

// @function splitWords(str: String): String[]
// Trims and splits the string on whitespace and returns the array of parts.
export function splitWords(str) {
	return str.trim().split(/\s+/);
}

// @function setOptions(obj: Object, options: Object): Object
// Merges the given properties to the `options` of the `obj` object, returning the resulting options. See `Class options`. Has an `L.setOptions` shortcut.
export function setOptions(obj, options) {
	if (!Object.hasOwn(obj, 'options')) {
		obj.options = obj.options ? Object.create(obj.options) : {};
	}
	for (const i in options) {
		if (Object.hasOwn(options, i)) {
			obj.options[i] = options[i];
		}
	}
	return obj.options;
}

/**
 * 将对象转换为参数 URL 字符串，例如 `{a: "foo", b: "bar"}` 转换为 `'?a=foo&b=bar'`。
 * @param {*} obj - 需要转换的对象
 * @param {*} existingUrl - 可选参数，如果设置了这个参数，那么参数将会被追加到这个参数的末尾。
 * @param {*} uppercase - 可选参数，如果设置为 true，那么参数名将会被转换为大写。
 * @returns {String} - 返回转换后的字符串
 * @example
 * getParamString({a: "foo", b: "bar"}) // '?a=foo&b=bar'
 * getParamString({a: "foo", b: "bar"}, 'http://www.example.com') // 'http://www.example.com?a=foo&b=bar'
 * getParamString({a: "foo", b: "bar"}, 'http://www.example.com', true) // 'http://www.example.com?A=foo&B=bar'
 */
export function getParamString(obj, existingUrl, uppercase) {
	const params = [];
	for (const i in obj) {
		if (Object.hasOwn(obj, i)) {
			params.push(`${encodeURIComponent(uppercase ? i.toUpperCase() : i)}=${encodeURIComponent(obj[i])}`);
		}
	}
	return ((!existingUrl || !existingUrl.includes('?')) ? '?' : '&') + params.join('&');
}

const templateRe = /\{ *([\w_ -]+) *\}/g;

/**
 * 简单的模板函数，接受一个模板字符串和一个数据对象，返回一个字符串。
 * @param {String} str - 模板字符串
 * @param {Object} data - 数据对象
 * @returns - 返回模板字符串替换后的字符串
 * @example
 * template('Hello {a}, {b}', {a: 'foo', b: 'bar'}) // 'Hello foo, bar'
 * template('Hello {a}, {b}', {a: 'foo', b: 'bar', c: 'baz'}) // 'Hello foo, bar'
 * template('Hello {a}, {b}', {a: 'foo'}) // Error: No value provided for variable {b}
 * template('Hello {a}, {b}', {a: 'foo', b: () => 'bar'}) // 'Hello foo, bar'
 * template('Hello {a}, {b}', {a: 'foo', b: (data) => data.a}) // 'Hello foo, foo'
 */
export function template(str, data) {
	return str.replace(templateRe, (str, key) => {
		let value = data[key];

		if (value === undefined) {
			throw new Error(`No value provided for variable ${str}`);
		} else if (typeof value === 'function') {
			value = value(data);
		}
		return value;
	});
}


/**
 * @constant emptyImageUrl
 * - 这个常量的主要用途是作为一个技巧，用于释放在基于 WebKit 的移动设备上未使用的图像的内存。
 * - 当你不再需要一个图像时，你可以将其 src 属性设置为这个字符串，这样浏览器就会释放该图像原本占用的内存。
 */
export const emptyImageUrl = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

// inspired by https://paulirish.com/2011/requestanimationframe-for-smart-animating/

/**
 * 这段代码定义了一个名为 getPrefixed 的函数，它接受一个参数 name。这个函数的主要目的是获取浏览器特定前缀的 JavaScript API。
 * @param {string} name - 浏览器特定前缀的 JavaScript API 名称
 * @returns - 返回浏览器特定前缀的 JavaScript API
 */
function getPrefixed(name) {
	return window[`webkit${name}`] || window[`moz${name}`] || window[`ms${name}`];
}

let lastTime = 0;

// fallback for IE 7-8
function timeoutDefer(fn) {
	const time = +new Date(),
	    timeToCall = Math.max(0, 16 - (time - lastTime));

	lastTime = time + timeToCall;
	return window.setTimeout(fn, timeToCall);
}

export const requestFn = window.requestAnimationFrame || getPrefixed('RequestAnimationFrame') || timeoutDefer;
export const cancelFn = window.cancelAnimationFrame || getPrefixed('CancelAnimationFrame') ||
		getPrefixed('CancelRequestAnimationFrame') || function (id) { window.clearTimeout(id); };

// @function requestAnimFrame(fn: Function, context?: Object, immediate?: Boolean): Number
// Schedules `fn` to be executed when the browser repaints. `fn` is bound to
// `context` if given. When `immediate` is set, `fn` is called immediately if
// the browser doesn't have native support for
// [`window.requestAnimationFrame`](https://developer.mozilla.org/docs/Web/API/window/requestAnimationFrame),
// otherwise it's delayed. Returns a request ID that can be used to cancel the request.
export function requestAnimFrame(fn, context, immediate) {
	if (immediate && requestFn === timeoutDefer) {
		fn.call(context);
	} else {
		return requestFn.call(window, fn.bind(context));
	}
}

// @function cancelAnimFrame(id: Number): undefined
// Cancels a previous `requestAnimFrame`. See also [window.cancelAnimationFrame](https://developer.mozilla.org/docs/Web/API/window/cancelAnimationFrame).
export function cancelAnimFrame(id) {
	if (id) {
		cancelFn.call(window, id);
	}
}
