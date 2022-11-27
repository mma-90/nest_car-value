import { rm } from 'fs/promises';
import * as path from 'path';

// delete db before each test
console.log('🚩 database have been deleted');
global.beforeEach(async () => {
  try {
    console.log(path.join(__dirname, '../', 'test.sqlite'));
    await rm(path.join(__dirname, '../', 'test.sqlite'));
  } catch (error) {
    console.log('💥cant find test.sqlite', error);
  }
});
