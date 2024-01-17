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
 * 这段代码定义了一个名为 getPrefixed 的函数，它接受一个参数 name。这个函数的主要目的是获取浏览器特定前缀的 JavaScript API。
 * @param {string} name - 浏览器特定前缀的 JavaScript API 名称
 * @returns - 返回浏览器特定前缀的 JavaScript API
 */
function getPrefixed(name) {
	return window[`webkit${name}`] || window[`moz${name}`] || window[`ms${name}`];
}

// test
let test1 = throttle(function () {console.log('test');}, 10000, null);

// 绑定事件 id = test1
document.getElementById('test1').addEventListener('click', () => {
    console.log('click!');
    test1();
});

function test2() {
	let res1 = template('Hello {a}, {b}', {a: 'foo', b: 'bar'});
	console.log(res1);
	let res2 = template('Hello {a}, {b}', {a: 'foo', b: 'bar', c: 'baz'});
	console.log(res2);
	let res3 = template('Hello {a}, {b}', {a: 'foo'});
	console.log(res3);
	let res4 = template('Hello {a}, {b}', {a: 'foo', b: () => 'bar'});
	console.log(res4);
	let res5 = template('Hello {a}, {b}', {a: 'foo', b: (data) => data.a});
	console.log(res5);
}

// 绑定事件 id = test2
document.getElementById('test2').addEventListener('click', () => {
	test2();
});

function test3() {
	// 测试基于特定前缀的 JavaScript API
	let res1 = getPrefixed('RequestAnimationFrame');
	console.log(res1);
	let res2 = getPrefixed('CancelAnimationFrame');
	console.log(res2);
}

// 绑定事件 id = test3
document.getElementById('test3').addEventListener('click', () => {
	test3();
});