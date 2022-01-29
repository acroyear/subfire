// a crazy conceptual idea that actually worked.  need to bring back the final version.

function getMethodsKeysOfObject(o: Record<string, any>): string[] {
    const rv: string[] = [];
    const keys = Object.keys(o);
    for (const k of keys) {
        const v = o[k];
        if (typeof v === 'function') {
            rv.push(k);
        }
    }
    return rv;
}

function getStateOfObject<T extends Record<string, any>> (o: T): T {
    const rv: Record<string, any> = {};
    const keys = Object.keys(o);
    for (const k of keys) {
        const v = o[k];
        if (typeof v !== 'function') {
            rv[k] = v;
        }
    }
    const urv = rv as unknown;
    return urv as T;
}

function wrapFunction(t: Record<string, any>, name: string, postFunc: () => void) {
    const func = t[name];
    return function() {
        func.apply(t, Array.prototype.slice.call(arguments));
        postFunc();
    }
}

interface StoreListener<T> {
    (t: T): void;
}

class Store<T extends Record<string, any>> {
    [key: string]: any;
    source: T;
    constructor(t: T) {
        this.source = t;
        const methodKeys = getMethodsKeysOfObject(t);
        for (const m of methodKeys) {
            this[m] = wrapFunction(this.source, m, this.emitChanged);
        }
    }

    getState = (): T => {
        const state = getStateOfObject(this.source);
        return state;
    }

    _batching = false;

    emitChanged = () => {
        if (this._batching) return;
        const state = this.getState();
        this.listeners.forEach(l => {
            l(state);
        })
    }

    listeners: Set<StoreListener<T>> = new Set();

    subscribe = (sl: StoreListener<T>) => {
        this.listeners.add(sl);
    }

    unsubscribe = (sl: StoreListener<T>) => {
        this.listeners.delete(sl);
    }

    batch = (f: () => void) => {
        this._batching = true;
        f();
        this._batching = false;
        this.emitChanged();
    }
}

/* test 1 - inferred from ReturnType of a pojo-builder function */

const MyPojoBuilder = (a: string) => {
    const x = {
        a,

        setA: (s: string) => {
            x.a = s;
        }
    }
    return x;
}

type MyPojoType = ReturnType<typeof MyPojoBuilder>;
const b = MyPojoBuilder("fred");
const c:MyPojoType = b; // just testing the cast works]
// const x = getMethodsKeysOfObject(b);
// const y = getStateOfObject(c);
export type MyPojo = Partial<Store<MyPojoType>> & Partial<MyPojoType>;
export const myPojoStore = new Store(b) as MyPojo;

console.log(myPojoStore.a); // should be undefined - but if we proxy, that might make it interesting...
console.log(myPojoStore.getState().a);
const listener = (state: MyPojo) => {
    console.log('subscribed', state);
};
myPojoStore.subscribe(listener);
myPojoStore.setA("string");
console.log(myPojoStore.getState().a);

myPojoStore.setA("string2");
console.log(myPojoStore.getState().a);

myPojoStore.unsubscribe(listener);
myPojoStore.setA("no more events this time");
console.log(myPojoStore.getState().a);

/* test 2 - from a Class */

class Class2 {
    constructor(x: string) {
        this.x = x;
    }
    x: string;
    setX = (y: string) => {
        this.x = y;
    }
}

const c2 = new Class2("hi");
const Class2Store = new Store(c2) as Partial<Store<Class2>> & Partial<Class2>;
Class2Store.subscribe((c2x) => {
    console.log({c2x});
});
Class2Store.setX('c2 setting');

/* test 3, from an interface, without caring where the object was built from or if formally cast to the interface */

const i3Builder = (init: string) => {
    const rv = {
        x: init,
        setX: (x: string) => {
            rv.x = x;
        }
    }
    return rv;
}

interface Interface3 {
    x: string;
    setX: (x:string) => void;
}

const i3 = i3Builder('init i3');

const Interface3Store = new Store(i3) as Partial<Store<Interface3>> & Partial<Interface3>;
Interface3Store.subscribe((ix3) => {
    console.log({ix3});
});
Interface3Store.setX('woah i3');

Interface3Store.batch(() => {
    Interface3Store.setX('no 1');
    Interface3Store.setX('no 2');
    Interface3Store.setX('yes 3');
});
