import parallel from './index';

describe('parallel', () => {
  it('should work with two actions', async () => {
    const action = parallel([
      {
        name: 'test',
        type: ['shape'],
        payload: {
          foo: 'bar',
        },
      },
      {
        type: ['shape'],
        payload: 'test',
      },
    ]);

    const res = await action.run();

    expect(res).toStrictEqual([{ foo: 'bar' }, 'test']);
  });

  it('should work with with nested parallel', async () => {
    const action = parallel([
      {
        name: 'test',
        type: ['parallel'],
        payload: [
          {
            type: ['shape'],
            payload: 'action.1.1',
          },
          {
            type: ['shape'],
            payload: 'action.1.2',
          },
        ],
      },
      {
        type: ['shape'],
        payload: 'action.2',
      },
    ]);

    const res = await action.run();

    expect(res).toStrictEqual([['action.1.1', 'action.1.2'], 'action.2']);
  });

  it('should NOT be able to access return of the first action from the second', async () => {
    const action = parallel([
      {
        name: 'test',
        type: ['shape'],
        payload: {
          foo: 'bar',
        },
      },
      {
        type: ['shape'],
        payload: '{{ $.test }}',
      },
    ]);

    const res = await action.run();

    expect(res).toStrictEqual([{ foo: 'bar' }, undefined]);
  });
});
