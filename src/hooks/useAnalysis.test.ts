import { describe, it, expect } from 'vitest';
import { validateZipFile, MAX_FILE_BYTES } from './useAnalysis';

/** Build a File-like object with just the fields validateZipFile reads. */
function fakeFile(name: string, size: number, type = ''): File {
    return { name, size, type } as File;
}

describe('validateZipFile', () => {
    it('accepts a normal .zip file', () => {
        expect(validateZipFile(fakeFile('export.zip', 1024))).toBeNull();
    });

    it('rejects a non-zip extension', () => {
        expect(validateZipFile(fakeFile('export.json', 1024))).toMatch(/\.zip/i);
    });

    it('rejects files above the size limit', () => {
        const oversized = fakeFile('huge.zip', MAX_FILE_BYTES + 1);
        expect(validateZipFile(oversized)).toMatch(/too large/i);
    });

    it('accepts a file exactly at the limit', () => {
        expect(validateZipFile(fakeFile('edge.zip', MAX_FILE_BYTES))).toBeNull();
    });
});
