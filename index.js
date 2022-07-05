require('dotenv').config();

const getNames = async filePath => {
  const fs = require('fs/promises');
  const data = await fs.readFile(filePath, 'utf-8');
  return data.split('\n');
};

if (process.env.NODE_ENV !== 'test') {
  let { argv } = require('yargs/yargs')(process.argv.slice(2)).check(argv1 => {
    if (argv1._.length !== 1) {
      throw new Error('Missing filepath for names list');
    }
    return true;
  });
  getNames(argv._[0]);
}

module.exports = { getNames };
