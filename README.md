# leaflet 源码研究
> - 仅保留核心代码，去除了一些不必要的代码（文档生成、测试等）
```js
export class BaseClass {
    constructor(options = {}) {
        this.options = options;
        this._initHooks = [];
        this._initHooksCalled = false;
    }

    addInitHook(fn, ...args) {
        const init = typeof fn === 'function' ? fn : function () {
            this[fn].apply(this, args);
        };

        this._initHooks.push(init);
        return this;
    }

    callInitHooks() {
        if (this._initHooksCalled) {
            return;
        }

        this._initHooks.forEach(hook => hook.call(this));
        this._initHooksCalled = true;
    }
}

export class ExtendedClass extends BaseClass {
    constructor(options = {}) {
        super(options);
        this.initialize();
        this.callInitHooks();
    }

    initialize() {
        // Initialization code goes here
    }
}
```