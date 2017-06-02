// Writing unit tests is entirely optional for the challenge.
// However we have included this unit test harness should you prefer to develop in a TDD environment.

// http://chaijs.com/api
// https://mochajs.org
// http://sinonjs.org/docs

describe('This test', function() {

  it('creates a progress bar', function() {
    var bar = new ProgressBar();
    bar.resize(6).increment(3);

    expect(bar.length).to.equal(6);
    expect(bar.completed).to.equal(3);

    bar.decrement(2);
    expect(bar.completed).to.equal(1);

    bar.increment(9);
    expect(bar.completed).to.equal(6);
  });

  it('passes', function() {
    expect(2 + 2).to.equal(4);
  });

  it('supports spies', function() {
    var spy = sinon.spy();
    spy();
    expect(spy.callCount).to.equal(1);
  });

  it('supports stubs', function() {
    var stub = sinon.stub().returns(42);
    expect(stub()).to.equal(42);
  });
});
