import { setOptions } from './Util.js';

export class Class {
	/** 
	* Extends the current class given the properties to be included.
	* Returns a Javascript function that is a class constructor (to be called with `new`).
	 * @function Class.extend(props)
	*/

	static extend({ statics, includes, ...props }) {
		class NewClass extends this {}

		// Inherit parent's static properties
		Object.setPrototypeOf(NewClass, this);

		const parentProto = this.prototype;
		const proto = NewClass.prototype;

		// Mix static properties into the class
		if (statics) {
			Object.assign(NewClass, statics);
		}

		// Mix includes into the prototype
		if (includes) {
			Object.assign(proto, ...includes);
		}

		// Mix given properties into the prototype
		Object.assign(proto, props);

		// Merge options
		if (proto.options) {
			proto.options = parentProto.options ? { ...parentProto.options } : {};
			Object.assign(proto.options, props.options);
		}

		proto._initHooks = [];

		return NewClass;
	}

	static include(props) {
		const parentOptions = this.prototype.options;
		Object.assign(this.prototype, props);

		if (props.options) {
			this.prototype.options = parentOptions;
			this.mergeOptions(props.options);
		}

		return this;
	}

	static mergeOptions(options) {
		Object.assign(this.prototype.options, options);
		return this;
	}

	static addInitHook(fn, ...args) {
		const init = typeof fn === 'function' ? fn : function () {
			this[fn](...args);
		};

		this.prototype._initHooks = this.prototype._initHooks || [];
		this.prototype._initHooks.push(init);

		return this;
	}

	_initHooksCalled = false;

	constructor(...args) {
		setOptions(this); 

		// Call the constructor
		if (this.initialize) {
			this.initialize(...args);
		}

		// Call all constructor hooks
		this.callInitHooks();
	}

	callInitHooks() {
		if (this._initHooksCalled) {
			return;
		}

		// Collect all prototypes in chain
		const prototypes = [];
		let current = this;

		while ((current = Object.getPrototypeOf(current)) !== null) {
			prototypes.push(current);
		}

		// Reverse so the parent prototype is first
		prototypes.reverse();

		// Call init hooks on each prototype
		for (const proto of prototypes) {
			for (const hook of proto._initHooks ?? []) {
				hook.call(this);
			}
		}

		this._initHooksCalled = true;
	}
}
