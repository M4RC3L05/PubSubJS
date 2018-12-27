import { isMyValidString, isValidAction } from '../../../utils/assertions'

describe('Asertion tests', () => {
    it('Should be a valid string', () => {
        expect(isMyValidString('')).toBe(true)
        expect(isMyValidString(1)).toBe(false)
        expect(isMyValidString([])).toBe(false)
        expect(isMyValidString({})).toBe(false)
        expect(isMyValidString(false)).toBe(false)
        expect(isMyValidString(null)).toBe(false)
        expect(isMyValidString(undefined)).toBe(false)
        expect(isMyValidString(NaN)).toBe(false)
        expect(isMyValidString(() => {})).toBe(false)
        expect(isMyValidString(function() {})).toBe(false)
    })

    it('Should be a valid pub sub action', () => {
        expect(isValidAction('')).toBe(false)
        expect(isValidAction(1)).toBe(false)
        expect(isValidAction([])).toBe(false)
        expect(isValidAction({})).toBe(false)
        expect(isValidAction(false)).toBe(false)
        expect(isValidAction(null)).toBe(false)
        expect(isValidAction(undefined)).toBe(false)
        expect(isValidAction(NaN)).toBe(false)
        expect(isValidAction(() => {})).toBe(true)
        expect(isValidAction(function() {})).toBe(true)
    })
})
