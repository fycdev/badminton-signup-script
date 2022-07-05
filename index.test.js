require('dotenv').config();

describe('Required enviroment variables', () => {
  it('are present', () => {
    const environmentKeys = Object.keys(process.env);
    expect(environmentKeys).toEqual(
      expect.arrayContaining(['BG_WEBSITE', 'BG_USER', 'BG_PASS'])
    );
  });
});
