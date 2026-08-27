import { describe, it, expect } from 'vitest';
import { NotFoundPage } from '../../pages/NotFoundPage';

describe('Public 404 / NotFound Page Foundation', () => {
  it('should export a defined NotFoundPage component', () => {
    expect(NotFoundPage).toBeDefined();
    expect(typeof NotFoundPage).toBe('function');
  });
});
