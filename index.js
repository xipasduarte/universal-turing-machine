export default class UniversalTuringMachine {
  constructor({tape = '', transitions = '', initialState = ''}) {
    this.state = {
      tape: tape.split(''),
      transitions: this.parseTransitions(transitions),
      head: 0,
      isTerminal: false,
    };
    console.log(this.state.tape);
    this.setInitialMachineState();
    initialState = initialState === '' ? this.state.transitions[0].start : initialState;
    this.setMachineState(initialState);
  }

  parseTransitions(transitionsString) {
    const transitions = [];

    Array.prototype.map.call(transitionsString.split("\n"), (transition) => {
      transition = transition.trim().replace(/ {2,}/, ' ').toLowerCase().split(' ');
      if (transition.length === 5) {
        transitions.push({
          start: transition[0],
          read: transition[1],
          write: transition[2],
          move: transition[3],
          end: transition[4],
        });
      }
    });

    console.log(transitions);

    return transitions;
  }

  setInitialMachineState() {
    if (this.state.transitions.length > 0) {
      this.state.initialMachine = {
        state: this.state.transitions[0].start,
        tape: this.state.tape,
      };
    }
  }

  setMachineState(newState) {
    if (newState !== '') {
      this.state.machineState = newState;
    }
  }

  getTape() {
    return this.state.tape;
  }

  getMachineState() {
    return this.state.machineState;
  }

  isTerminalState(state) {
    const terminalStates = ['halt-accept', 'halt-reject', 'halt-abort']
    for (let i = 0; i < terminalStates.length; i++) {
      if (state === terminalState[i]) {
        return true;
      }
    }
    return false;
  }

  abortComputation() {
    this.state.machineState = 'halt-abort';
  }

  readTape() {
    return this.state.tape[this.state.head];
  }

  writeTape(symbol) {
    this.state.tape[this.state.head] = symbol;
  }

  getTransition(symbol) {
    for (let i = 0; i < this.state.transitions.length; i++) {
      if (this.state.transitions[i].start === this.state.machineState && this.state.transitions[i].read === symbol) {
        return this.state.transitions[i];
      }
    }
    this.abortComputation();
    return false;
  }

  moveHead(move, reverse = false) {
    if (move === 'l' && !reverse || move === 'r' && reverse) {
      this.state.head -= 1;
    } else if (move === 'r' && !reverse || move === 'l' && reverse) {
      this.state.head += 1;
    } else {
      this.abortComputation();
    }
  }

  nextState() {
    console.log(this.state.machineState);
    const transition = this.getTransition(this.readTape());
    console.log(transition);
    this.writeTape(transition.write);
    this.moveHead(transition.move);
    this.setMachineState(transition.end);
    return {
      tape: this.state.tape,
      head: this.state.head,
      transition
    };
  }
}
