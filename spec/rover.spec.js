const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {

  it("constructor sets position and default values for mode and generatorWatts", function() {
    let roverOne = new Rover();
    expect(roverOne).toEqual(new Rover(undefined, 'NORMAL', 110));
    expect(roverOne.position).toEqual(undefined);
    expect(roverOne.mode).toEqual('NORMAL');
    expect(roverOne.generatorWatts).toEqual(110);
  });

  it("response returned by receiveMessage contains name of message", function() {
    let message = new Message ('Test Message', []);
    let roverTwo = new Rover();
    let response = roverTwo.receiveMessage(message);
    expect(response.Message).toEqual('Test Message');
  });

  it("response returned by receiveMessage includes two results if two commands are sent in the message", function() {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let roverThree = new Rover(98382);
    let response = roverThree.receiveMessage(message);

    expect(response.Message).toEqual('Test message with two commands');
    expect(response.results[0].completed).toEqual('true');
    expect(response.results[1].completed).toEqual('true');
  });

  it("responds correctly to status check command", function() {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let roverFour = new Rover(98382);
    let response = roverFour.receiveMessage(message);
    
    expect(typeof response.results[1].roverStatus).toEqual('object');
    expect(response.results[1].roverStatus.mode).toEqual('LOW_POWER');
    expect(response.results[1].roverStatus.generatorWatts).toEqual(110);
    expect(response.results[1].roverStatus.position).toEqual(98382);
  });

  it("responds correctly to mode change command", function() {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let roverFive = new Rover(98382);
    let response = roverFive.receiveMessage(message);

    expect(typeof response.results[1]).toEqual('object');
    expect(response.results[1].completed).toEqual('true');
    expect(response.results[1].roverStatus.mode).toEqual('LOW_POWER');
  });

  it("responds with false completed value when attempting to move in LOW_POWER mode", function() {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK'), new Command('MOVE', 500)];
    let message = new Message('Test message with two commands', commands);
    let roverSix = new Rover(98382);
    let response = roverSix.receiveMessage(message);

    expect(typeof response.results[2]).toEqual('object');
    expect(response.results[2].completed).toEqual('false');
  });

  it("responds with position for move command", function() {
    let commands = [new Command('MODE_CHANGE', 'NORMAL'), new Command('STATUS_CHECK'), new Command('MOVE', 500)];
    let message = new Message('Test message with two commands', commands);
    let roverSeven = new Rover(98382);
    let response = roverSeven.receiveMessage(message);

    expect(typeof response.results[2]).toEqual('object');
    expect(response.results[2].completed).toEqual('true');
    expect(response.results[1].roverStatus.position).toEqual(500);
  });

});