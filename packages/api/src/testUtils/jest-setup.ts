/*
  Might be a good idea to have different setup files for different types of tests.
  These set up files can be referrenced by specific jest.config.json files depending
  on the test type (e.g. unit, integration, or acceptance)
*/

beforeAll(() => {
    // console.log('This will run before each test file, but may not have access to postres db yet');
});

afterAll(() => {
    // console.log('This will run after each test file, but the postgres may be already closed...');
});
