import {Team} from './team';
import {TestMatch} from './match.test';

let curMatchNum = 0;

/** generates a match for testing */
export function makeMatch(points: number) {
    const match = new TestMatch(5940, 'test', curMatchNum++, 'BLUE', [], {bonusPoints: points});
    return match;
}

const testTeam = new Team(
    5940,
    ...[1, 1, 5, 1000, 6, 9, 1, 1, 10, 30].map(makeMatch),
);

test('Team#getMean should return the mean', () => {
    expect(testTeam.getMean('points')).toEqual(106.4);
});

test('Team#getMode should return the mode', () => {
    expect(testTeam.getMode('points')).toEqual(1);
});

test('Team#getMedian should return the median', () => {
    expect(testTeam.getMedian('points')).toEqual(5.5);

    testTeam.matches = testTeam.matches.filter((match) => match.bonusPoints !== 10);
    expect(testTeam.getMedian('points')).toEqual(5);
});

test('statistical functions should throw errors when used on non-numerical properties', () => {
    expect(() => testTeam.getMean('borked')).toThrowError(/non-number property/);
    expect(() => testTeam.getMode('borked')).toThrowError(/non-number property/);
    expect(() => testTeam.getMedian('borked')).toThrowError(/non-number property/);
});

test('adding matches should fail if you try to add matches from other teams', () => {
    expect(() => testTeam.addMatches(new TestMatch(5941, 'test', 1, 'RED', [], {})))
        .toThrowError(/Matches to be added to team/);

    expect(() => testTeam.addMatches(new TestMatch(5940, 'test', 1, 'RED', [], {})))
        .not.toThrow();
});
