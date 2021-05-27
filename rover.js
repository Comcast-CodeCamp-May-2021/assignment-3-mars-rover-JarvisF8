class Rover {
  constructor(position) {
    this.position = position;
    this.mode = 'NORMAL';
    this.generatorWatts = 110;
  }
  receiveMessage(message) {
    let messageObject = {};
    let results = [];
    let modeObject = {};
    let statusObject = {};
    let moveObject = {};
    let roverStatus = {mode: this.mode, generatorWatts: this.generatorWatts, position: this.position}

    messageObject['Message'] = message.name;

    for (let i in message.commands) {

      if (message.commands[i].commandType === 'MODE_CHANGE') {
        if (message.commands[i].value === 'LOW_POWER') {
          roverStatus.mode = 'LOW_POWER';
          modeObject['completed'] = 'true';
          results.push(modeObject);
        } 
        else {
          roverStatus.mode = 'NORMAL';
          modeObject['completed'] = 'true';
          results.push(modeObject);
        }
      } 
      else if (message.commands[i].commandType === 'STATUS_CHECK') {
        statusObject['completed'] = 'true';
        statusObject['roverStatus'] = roverStatus;
        results.push(statusObject);
      }
      else if (message.commands[i].commandType === 'MOVE') {
        if (roverStatus.mode !== 'LOW_POWER') {
          this.position = message.commands[i].value;
          roverStatus.position = message.commands[i].value;
          moveObject['completed'] = 'true';
          results.push(moveObject);
        }
        else {
          moveObject['completed'] = 'false';
          results.push(moveObject);
        }
      }
    }

    messageObject['results'] = results;

    // console.log();
    // console.log(messageObject);
    // console.log();
    return messageObject;
  }
}

module.exports = Rover;