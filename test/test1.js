// @function setOptions(obj: Object, options: Object): Object
// Merges the given properties to the `options` of the `obj` object, returning the resulting options. See `Class options`. Has an `L.setOptions` shortcut.
function setOptions(obj, options) {
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

class Class {
	/** 
	* Extends the current class given the properties to be included.
	* Returns a Javascript function that is a class constructor (to be called with `new`).
	* @function Class.extend(props)
	*/
	static extend({ statics, includes, ...props }) {
		class NewClass extends this {} // this 指的是调用extend方法的类，即当前类。这里相当于创建了一个新的类，这个类继承了当前类。

		// Inherit parent's static properties
		Object.setPrototypeOf(NewClass, this); // 这意味着NewClass的原型对象是当前类。 

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
		Object.assign(this.prototype, props); // 这意味着如果props对象中有与类原型对象中同名的属性，那么这些属性的值将被props对象中的值覆盖。

		if (props.options) {
			this.prototype.options = parentOptions;
			this.mergeOptions(props.options); // 这意味着，如果props对象中有一个名为options的属性，那么它的值将被合并到类原型对象的options属性中，而不是直接覆盖。
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
			for (const hook of proto._initHooks ?? []) { // 遍历每个原型的_initHooks
				hook.call(this);
			}
		}

		this._initHooksCalled = true;
	}
}

// Test Class and its methods
class ChildClass extends Class {
  initialize() {
    console.log('ChildClass initialized');
  }
}

const ExtendedClass = Class.extend({
  statics: {
    staticMethod() {
      console.log('Static method called');
    },
  },
  includes: [
    {
      instanceMethod() {
        console.log('Instance method called');
      },
	  print(text) {
		console.log(text);
	  }
    },
  ],
  options: {
    option1: 'default1',
    option2: 'default2',
	arr: [1,2,3],
  },
});




ExtendedClass.addInitHook("print","hello world!");
const instance = new ExtendedClass();

ExtendedClass.prototype.instanceMethod();

console.log('Extended Class:', instance);
