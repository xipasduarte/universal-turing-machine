# Universal Turing Machine

A Universal Turing Machine is a Turing machine that can execute all other Turing machines (including itself).

This project is the implementation such a machine in JavaScript. It will be usable as a CLI tool, but it's main purpose is to power a future implementation of an interface for users to interact with.

## Core concepts

### Tape

The tape is the persistent storage of the machine, it can hold any symbol appart from `_`, which is reserve the represent an empty slot. The tape is infinite strip of descrete slots holding symbols, with a starting point.

### Head

The tape has a head that is positioned on the starting position and can move Left or Right. Trying to move the head further left than the starting position results in a computation error. Also, the head can only move on slot at a time.

### Machine-state

The machine is always in a state. This state is nothing but a reference of the programmer's choice, and can symbolize multiple things, depending on how the transitions are defined.

The initial machine-state can be supplied when the machine is created. By default it is set to be the starting state of the first transition.

#### Terminal machine-states

There are three reserved keywords to define the three final states (states that can not have transitions starting on them).

- `halt-accept` - stop computation and accept input
- `halt-reject` - stop computation and reject input
- `halt-abort` - stop computation due to anything that prevents the computation from proceeding

### Transition

A transition is a discription of what happens when the machine is on a given state and the symbol at the head's position has a certain value. It also specifies the symbol to write over the one that was read, the move to make for the head (Left or Right) and the machine-state that should be set.

```
qin 0 1 r qout
```

- `qin` – current machine-state
- `0` - symbol that is on the tape at the head's position
- `1` - symbol to write over the prevous one
- `r` - movement to be applied to the head
- `qout` - new machine-state

## TODO

### Version 1.0.0

The following is a list of the features that are in development.

- [X] Parse tape as from a string.
- [X] Parse transitions from string.
- [X] Allow for initial machine-state to be provided, not simply the default (the first transition's starting machine-state).
- [X] Step by step computation (forward).
- [X] Step by step computation (backwards).
- [X] Full run.
- [X] Abort computation when there is no defined transition to perform.
- [X] Abort computation when when moving blow the first slot.
- [X] Handle terminal machine-states output.
- [X] Retrieve the machine properties:
  - [X] Tape contents
  - [X] Machine-state
  - [X] Head position
  - [X] Transitions
- [ ] Extract tape and transition parsing.
- [ ] Full test coverage.
- [ ] Full code documentation.
- [ ] Usage documentation.

### Future
- [ ] Have more than one tape.


## License

[MIT](LICENSE).
