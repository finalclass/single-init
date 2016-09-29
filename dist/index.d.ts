declare class SingleInit<T> {
    private initFunc;
    private callbacks;
    private state;
    private resultErr;
    private result;
    constructor(initFunc: (done: (err: Error, result?: T) => void) => void);
    get(callback?: (err: Error, result?: T) => void): Promise<T>;
    private initialize();
    private callCallbacks();
}
export = SingleInit;
