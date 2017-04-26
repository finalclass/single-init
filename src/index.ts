declare var console: any;

export default class SingleInit<T> {

    private callbacks: ((err: Error | null, result: T) => void)[] = [];
    private _state: 'cold' | 'initializing' | 'complete' = 'cold';
    private resultErr: Error = null;
    private result: T = null;

    constructor(
        private initFunc: (done: (err: Error | null, result?: T) => void) => void
    ) { }

    public get(callback: (err: Error | null, result?: T) => void = (err) => { }): Promise<T> {
        return new Promise((resolve, reject) => {
            function callbackWrapped(err, data) {
                if (err) {
                    reject(err);
                    callback(err);
                } else {
                    resolve(data);
                    callback(null, data);
                }
            }
            if (this._state === 'complete') {
                return callbackWrapped(this.resultErr, this.result);
            }
            //if it's initializing then callback will be called anyway:
            this.callbacks.push(callbackWrapped);
            if (this._state === 'cold') {
                this.initialize();
            }
        });
    }

    public get state() {
        return this._state;
    }

    private initialize() {
        this._state = 'initializing';
        this.initFunc((err: Error | null, result: T) => {
            this._state = 'complete';
            if (err) {
                this.resultErr = err;
                this.callCallbacks();
            } else {
                this.result = result;
                this.callCallbacks();
            }
        });
    }

    private callCallbacks() {
        this.callbacks.forEach((callback) => {
            callback(this.resultErr, this.result);
        });
        this.callbacks = [];
    }

}
