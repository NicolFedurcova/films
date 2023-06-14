import { CharacterToStringPipe } from './character-to-string.pipe';

describe('CharacterToStringPipe', () => {
  it('create an instance', () => {
    const pipe = new CharacterToStringPipe();
    expect(pipe).toBeTruthy();
  });
});
