declare var console:any;

class SingleInit<T> {

    private callbacks: ((err: Error, result: T) => void)[] = [];
    private state: 'cold' | 'initializing' | 'complete' = 'cold';
    private resultErr: Error = null;
    private result: T = null;

    constructor(
        private initFunc: (done: (err: Error, result?: T) => void) => void
    ) { }

    public get(callback: (err: Error, result?: T) => void = (err) => { }): Promise<T> {
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
            if (this.state === 'complete') {
                return callbackWrapped(this.resultErr, this.result);
            }
            //if it's initializing then callback will be called anyway:
            this.callbacks.push(callbackWrapped);
            if (this.state === 'cold') {
                this.initialize();
            }
        });
    }

    private initialize() {
        this.state = 'initializing';
        this.initFunc((err: Error, result: T) => {
            this.state = 'complete';
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

export = SingleInit;