require('dotenv').config();

describe('Required environment variables', () => {
  it('are present', () => {
    const environmentKeys = Object.keys(process.env);
    expect(environmentKeys).toEqual(
      expect.arrayContaining(['BG_WEBSITE', 'BG_USER', 'BG_PASS'])
    );
  });
});

describe('getNames', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('return list of names as an array', async () => {
    const { getNames } = require('../index');
    expect(await getNames('./tests/testnames.txt')).toMatchInlineSnapshot(`
Array [
  "Julius",
  "Augustus",
  "Maximus",
]
`);
  });
});
