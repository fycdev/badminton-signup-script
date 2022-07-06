import 'dotenv/config';

describe('Required environment variables', () => {
  it('should be present', () => {
    const environmentKeys = Object.keys(process.env);
    expect(environmentKeys).toEqual(
      expect.arrayContaining(['BG_WEBSITE', 'BG_USER', 'BG_PASS', 'BG_MOBILE'])
    );
  });
});

describe('Names list', () => {
  const originalArgv = process.argv;

  beforeEach(() => {
    process.argv.push('--names', './tests/names.test.txt');
  });

  afterEach(() => {
    process.argv = originalArgv;
  });

  it('should output an array of names', async () => {
    const { getNames } = require('../index');
    expect(await getNames()).toMatchInlineSnapshot(`
Array [
  "Julius",
  "Augustus",
  "Maximus",
]
`);
  });
});
