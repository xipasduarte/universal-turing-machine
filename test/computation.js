import test from 'ava';
import UniversalTuringMachine from '..'

const machine = new UniversalTuringMachine({
  tape: '01',
  transitions: 'qin 0 0 R q1\nqin 1 1 R qin\nq1 1 1 R halt-accept',
});

test('next-step-normal', t => {
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
});

test('next-state-last', t => {
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
    'Test nextStep reaches terminal state.'
  );
});

test('next-state-terminal', t => {
  t.is(
    machine.nextState(),
    'halt-accept',
    'Test return of nextStep in terminal state.'
  );
});

test('previous-step-normal', t => {
  t.deepEqual(
    {
      tape: ['0', '1'],
      head: 1,
      isTerminalState: false,
    },
    machine.previousState(),
    'Test previousState normal.'
  );
});

test('previous-state-first', async t => {
  t.deepEqual(
    {
      tape: ['0', '1'],
      head: 0,
      isTerminalState: false,
    },
    machine.previousState(),
    'Test previousState reaching initialStep.'
  );
});

test('previous-step-initial', t => {
  t.false(
    machine.previousState(),
    'Test previousState reaching initial state.'
  );
});

const acceptMachine = new UniversalTuringMachine({
  tape: '01',
  transitions: 'qin 0 0 r q1\nq1 1 1 r halt-accept',
});
const rejectMachine = new UniversalTuringMachine({
  tape: '01',
  transitions: 'qin 0 0 r q1\nq1 1 1 r halt-reject',
});
const abortMachine = new UniversalTuringMachine({
  tape: '01',
  transitions: 'qin 0 0 r q1',
});

test('run-accept', t => {
  t.is(acceptMachine.run(), 'halt-accept', 'Accepted computation.');
});

test('run-reject', t => {
  t.is(rejectMachine.run(), 'halt-reject', 'Rejected computation.');
});

test('run-abort', t => {
  t.is(abortMachine.run(), 'halt-abort', 'Aborted computation.');
});

test('re-run', t => {
  t.is(acceptMachine.run(), 'halt-accept', 'Accepted computation.');
  t.is(rejectMachine.run(), 'halt-reject', 'Rejected computation.');
  t.is(abortMachine.run(), 'halt-abort', 'Aborted computation.');
});
