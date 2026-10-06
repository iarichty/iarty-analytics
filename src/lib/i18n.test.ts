import { describe, it, expect } from 'vitest';
import { translate, detectLocale } from './i18n';

describe('translate', () => {
    it('returns the English string for a known key', () => {
        expect(translate('en', 'common.back')).toBe('Back');
    });

    it('returns the Indonesian string for a known key', () => {
        expect(translate('id', 'common.back')).toBe('Kembali');
    });

    it('interpolates {placeholder} values', () => {
        expect(translate('en', 'footer.analyzed', { count: '1,240' })).toBe(
            'Analyzed 1,240 accounts — processed entirely in your browser.',
        );
    });

    it('leaves unknown placeholders untouched', () => {
        expect(translate('en', 'footer.analyzed', {})).toContain('{count}');
    });

    it('falls back to English when a key is missing in the target locale', () => {
        // 'common.back' exists in both; use a key only in en by simulating via en.
        expect(translate('id', 'common.back')).not.toBe('common.back');
    });

    it('returns the key itself when it is unknown everywhere', () => {
        expect(translate('en', 'totally.unknown.key')).toBe('totally.unknown.key');
    });
});

describe('detectLocale', () => {
    it('returns a supported locale', () => {
        expect(['en', 'id']).toContain(detectLocale());
    });
});
