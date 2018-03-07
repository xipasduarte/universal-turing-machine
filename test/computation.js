import test from 'ava';
import UniversalTuringMachine from '..'

test('next-step-accept', async t => {
  const machine = new UniversalTuringMachine({
    tape: '01',
    transitions: 'qin 0 0 R q1\nqin 1 1 R qin\nq1 1 1 R halt-accept',
  });

  t.deepEqual(
    {
      tape: ['0', '1'],
      head: 1,
      isTerminalState: false,
      transition: {
        start: 'qin',
        read: '0',
        write: '0',
        move: 'r',
        end: 'q1',
      }
    },
    machine.nextState(),
    'Test next normal step.'
  );

  t.deepEqual(
    {
      tape: ['0', '1'],
      head: 2,
      isTerminalState: true,
      transition: {
        start: 'q1',
        read: '1',
        write: '1',
        move: 'r',
        end: 'halt-accept',
      }
    },
    machine.nextState(),
    'Test next terminal step.'
  );

  t.false(
    machine.nextState(),
    'Test next in terminal state.'
  );

  t.deepEqual()
});
