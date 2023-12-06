import { tineCtx } from '../../tineHelpers';
import serial from './index';

describe('serial', () => {
  it('should work with two actions', async () => {
    const action = serial([
      {
        name: 'test',
        type: ['shape'],
        params: {
          foo: 'bar',
        },
      },
      {
        type: ['shape'],
        params: 'test',
      },
    ]);

    const res = await action.run(tineCtx());

    expect(res).toStrictEqual([{ foo: 'bar' }, 'test']);
  });

  it('should work with with nested serial', async () => {
    const action = serial([
      {
        name: 'test',
        type: ['serial'],
        params: [
          {
            type: ['shape'],
            params: 'action.1.1',
          },
          {
            type: ['shape'],
            params: 'action.1.2',
          },
        ],
      },
      {
        type: ['shape'],
        params: 'action.2',
      },
    ]);

    const res = await action.run(tineCtx());

    expect(res).toStrictEqual([['action.1.1', 'action.1.2'], 'action.2']);
  });

  it('should be able to access return of the first action from the second', async () => {
    const action = serial([
      {
        name: 'test',
        type: ['shape'],
        params: {
          foo: 'bar',
        },
      },
      {
        type: ['shape'],
        params: '{{ $.test }}',
      },
    ]);

    const res = await action.run(tineCtx());

    expect(res).toStrictEqual([{ foo: 'bar' }, { foo: 'bar' }]);
  });
});
