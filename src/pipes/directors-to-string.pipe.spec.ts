import { DirectorsToStringPipe } from './directors-to-string.pipe';

describe('DirectorsToStringPipe', () => {
  it('create an instance', () => {
    const pipe = new DirectorsToStringPipe();
    expect(pipe).toBeTruthy();
  });
});
