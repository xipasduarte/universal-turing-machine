'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var forEach = _interopDefault(require('lodash/forEach'));
var replace = _interopDefault(require('lodash/replace'));
var split = _interopDefault(require('lodash/split'));
var toLower = _interopDefault(require('lodash/toLower'));
var trim = _interopDefault(require('lodash/trim'));

class UniversalTuringMachine {
  constructor({tape = '', transitions = '', initialState = ''}) {
    this.state = {
      tape: split(tape, ''),
      transitions: this.parseTransitions(transitions),
      head: 0,
      isTerminal: false,
    };
    this.setInitialMachineState();
    initialState = initialState === '' ? this.state.transitions[0].start : initialState;
    this.setMachineState(initialState);
  }

  /**
   * Define intial state for machine.
   * The default is the first transition start state.
   */
  setInitialMachineState() {
    if (this.state.transitions.length > 0) {
      this.state.initialMachine = {
        state: this.state.transitions[0].start,
        tape: this.state.tape,
      };
    }
  }

  /**
   * Define machine state from input.
   * @param {string} newState The new state for the machine.
   */
  setMachineState(newState) {
    if (newState !== '') {
      this.state.machineState = newState;
    }
  }

  /**
   * Write symbol to tape at the current position of the machine's head.
   * @param {string} symbol The symbol to write.
   */
  writeTape(symbol) {
    this.state.tape[this.state.head] = symbol;
  }

  /**
   * @return {Array} The current tape values.
   */
  getTape() {
    return this.state.tape;
  }

  /**
   * @return {string} The current state of the machine.
   */
  getMachineState() {
    return this.state.machineState;
  }

  /**
   * @return {Array} An array with the transitions this machine handles.
   */
  getTransitions() {
    return this.state.transitions;
  }

  /**
   * @return {Object} The specific transition given the current state of the
   *                  machine and the symbol read from the tape.
   */
  getTransition(reverse = false) {

    // Current symbol on the tape at the head's position.
    const symbol = this.readTape();

    // Search for transition.
    for (let i = 0; i < this.state.transitions.length; i++) {
      if (this.state.transitions[i].start === this.state.machineState) {
        if (
          !reverse && this.state.transitions[i].read === symbol ||
          reverse && this.state.transitions[i].write === symbol
        ) {
          return this.state.transitions[i];
        }
      }
    }

    // No transition was found, abort computation.
    this.abortComputation();
  }

  /**
   * @return {string} Symbol on the machine's tape at the head position.
   */
  readTape() {
    return this.state.tape[this.state.head];
  }

  parseTransitions(transitionsString) {
    const transitions = [];

    forEach(split(transitionsString, '\n'), (transition) => {
      transition = split(toLower(replace(trim(transition), / {2,}/, ' ')), ' ');
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

    return transitions;
  }

  isTerminalState(state) {
    const terminalStates = ['halt-accept', 'halt-reject', 'halt-abort'];
    for (let i = 0; i < terminalStates.length; i++) {
      if (state === terminalStates[i]) {
        return true;
      }
    }
    return false;
  }

  /**
   * Abort computation.
   * @throws error after changing the machine state.
   */
  abortComputation() {
    this.setMachineState('halt-abort');
    throw 'There is no transition defined for current state.';
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

  /**
   * Compute the next machine state.
   * @return {Object|boolean} False if the computation is in a terminal state
   *                          (see isTerminalState()), otherwise an object with
   *                          the transition information and current state.
   */
  nextState() {

    // If the machine state is final, don't execute.
    if (this.isTerminalState(this.getMachineState())) {
      return false;
    }

    const transition = this.getTransition();

    this.writeTape(transition.write);
    this.moveHead(transition.move);
    this.setMachineState(transition.end);

    return {
      tape: this.getTape(),
      head: this.state.head,
      isTerminalState: this.isTerminalState(this.getMachineState()),
      transition,
    };
  }
}

module.exports = UniversalTuringMachine;
