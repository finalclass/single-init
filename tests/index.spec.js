var SingleInit = require('../dist/index').default;

describe('single-init', function () {

    it('initializes thinks once', function (done) {
        var callCount = 0;
        var num = new SingleInit(function (initComplete) {
            callCount += 1;
            setTimeout(function () {
                initComplete(null, 5);
            }, 100);
        });

        let catchSpy = jasmine.createSpy();
        num.get().then(function (gotNum) {
            expect(gotNum).toBe(5);
        }).catch(catchSpy);
        expect(catchSpy).not.toHaveBeenCalled();

        num.get(function (err, gotNum) {
            expect(err).toBe(null);
            expect(gotNum).toBe(5);
            expect(callCount).toBe(1);
            done();
        });

    });

});