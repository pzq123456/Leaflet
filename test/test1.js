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


// test
let test = throttle(function () {console.log('test');}, 10000, null);

// 绑定事件 id = test1
document.getElementById('test1').addEventListener('click', () => {
    console.log('click!');
    test();
});