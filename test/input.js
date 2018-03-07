import test from 'ava';
import UniversalTuringMachine from '..'

const goodMachine = new UniversalTuringMachine({
  tape: '0101',
  transitions: 'qin 0 0 R halt-accept\nqin 1 1 R halt-reject',
});

test('input-tape', async t => {
  t.deepEqual(goodMachine.getTape(), ['0', '1', '0', '1'], 'Parse tape input.');
});

test('input-transitions', async t => {
  t.deepEqual(goodMachine.getTransitions(), [
    {
      start: 'qin',
      read: '0',
      write: '0',
      move: 'r',
      end: 'halt-accept',
    },
    {
      start: 'qin',
      read: '1',
      write: '1',
      move: 'r',
      end: 'halt-reject',
    }
  ], 'Parse transition input.');
});

test('input-state', async t => {
  t.is(goodMachine.getMachineState(), 'qin', 'Default initial machine state.');
});

test('input-initial-state', async t => {
  const machine = new UniversalTuringMachine({
    tape: '0101',
    transitions: 'qin 0 0 R q1\nqin 1 1 R q2',
    initialState: 'q1'
  });

  t.is(machine.getMachineState(), 'q1', 'Set machine initial state.');
});
