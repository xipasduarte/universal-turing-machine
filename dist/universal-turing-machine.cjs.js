'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var forEach = _interopDefault(require('lodash/forEach'));
var replace = _interopDefault(require('lodash/replace'));
var split = _interopDefault(require('lodash/split'));
var toLower = _interopDefault(require('lodash/toLower'));
var trim = _interopDefault(require('lodash/trim'));
var isEmpty = _interopDefault(require('lodash/isEmpty'));

class UniversalTuringMachine {
  constructor({tape = '', transitions = '', initialState = ''}) {
    this.state = {
      tape: split(tape, ''),
      head: 0,
      isTerminal: false,
      transitionHistory: [],
    };

    this.transitions = this.parseTransitions(transitions);

    initialState = initialState === '' ? this.transitions[0].start : initialState;
    this.setMachineState(initialState);

    this.initialState = {
      tape: this.state.tape,
      machineState: initialState,
    };
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
   * Set the tape contents.
   * Triggers a reset of the machine stat to initial conditions.
   * @param {string} tape The new tape content.
   */
  setTape(tape) {
    this.state.tape = split(tape, '');
    this.state.transitionHistory = [];
    this.state.isTerminal = false;
    this.state.machineState = this.initialState.machineState;
  }

  /**
   * Write symbol to tape at the current position of the machine's head.
   * @param {string} symbol The symbol to write.
   */
  writeTape(symbol) {
    this.state.tape[this.state.head] = symbol;
  }

  /**
   * @return {int} Head position.
   */
  getHeadPosition() {
    return this.state.head;
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
    return this.transitions;
  }

  /**
   * @param {int} index The transition index on the transitions array.
   * @return {Object} The specific transition given the current state of the
   *                  machine and the symbol read from the tape.
   */
  getTransition(index = -1) {

    // Return a specific transition.
    if (index !== -1) {
      return this.transitions[index];
    }

    // Current symbol on the tape at the head's position.
    const symbol = this.readTape();

    // Search for transition.
    for (let i = 0; i < this.transitions.length; i++) {
      if (
        this.transitions[i].start === this.getMachineState() &&
        this.transitions[i].read === symbol
      ) {
        return this.transitions[i];
      }
    }

    // No transition was found, abort computation.
    return this.abortComputation();
  }

  getTransitionHistory() {
    return this.state.transitionHistory;
  }

  /**
   * @return {string} Symbol on the machine's tape at the head position.
   */
  readTape() {
    const tape = this.getTape();
    const head = this.getHeadPosition();

    if (head < tape.length) {
      return this.getTape()[this.getHeadPosition()];
    }

    // Empty slot space.
    return '_';
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
   * @return False to prevent further actions.
   */
  abortComputation() {
    this.setMachineState('halt-abort');
    return false;
  }

  /**
   * Move the tape head to it's next position.
   * @param {string} move The direction to move in the transition
   */
  moveHead(move) {
    if (move === 'l') {
      this.state.head -= 1;
    } else if (move === 'r') {
      this.state.head += 1;
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
      return this.getMachineState();
    }

    const transition = this.getTransition();

    if (!transition) {
      return false;
    }

    this.writeTape(transition.write);
    this.moveHead(transition.move);
    this.setMachineState(transition.end);
    this.state.isTerminal = this.isTerminalState(this.getMachineState());
    this.state.transitionHistory.push(this.getTransitions().indexOf(transition));

    return {
      tape: this.getTape(),
      head: this.state.head,
      isTerminalState: this.state.isTerminal,
      transition,
    };
  }

  previousState() {
    const history = this.getTransitionHistory();

    // If the machine returns to the start, don't execute.
    if (isEmpty(history)) {
      return false;
    }

    const transition = this.getTransition(history.pop());
    this.moveHead(transition.move === 'r' ? 'l' : 'r');
    this.writeTape(transition.read);
    this.setMachineState(transition.start);
    this.state.isTerminal = false;

    return {
      tape: this.getTape(),
      head: this.state.head,
      isTerminalState: this.state.isTerminal,
    };
  }

  run() {
    while (!this.isTerminalState(this.getMachineState())) {
      this.nextState();
    }

    return this.getMachineState();
  }
}

module.exports = UniversalTuringMachine;
