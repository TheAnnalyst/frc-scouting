/**
 * Models FRC teams
 *
 * @author Annika
 */

import {Match} from './match';

/** Represents a FRC team */
export class Team<T extends Match> {
    number: number;
    /** the matches that the team played in */
    matches: T[];

    /**
     * Instantiates a new team.
     * TODO: support passing in match numbers and looking them up from the DB
     */
    constructor(number: number, ...matches: T[]) {
        this.number = number;
        this.matches = matches;
    }

    /** Gets the mean of any match property */
    getMean(property: keyof T) {
        if (typeof this.matches[0][property] !== 'number') {
            throw new Error(`Attempted to get the mean of a non-number property of a Match ('${property}')`);
        }

        // `as` is safe because we check the type of the first match above
        return this.matches.reduce((acc, match) => acc + (match[property] as any as number), 0) / this.matches.length;
    }

    /** Gets the mode of any match property */
    getMode(property: keyof T) {
        /** value:occurences */
        const occurences = new Map<number, number>();
        for (const match of this.matches) {
            const value = match[property];
            if (typeof value !== 'number') {
                throw new Error(`Attempted to get the mode of a non-number property of a Match ('${property}')`);
            }
            occurences.set(value, (occurences.get(value) || 0) + 1);
        }

        return [...occurences].sort(
            // Sort occurences in descending order
            (a, b) => b[1] - a[1],
        )[0]?.[0];
    }

    /** Gets the median of any match property */
    getMedian(property: keyof Match) {
        if (typeof this.matches[0][property] !== 'number') {
            throw new Error(`Attempted to get the median of a non-number property of a Match ('${property}')`);
        }

        // `as` is safe because we check the type of the first match above
        const sortedValues = this.matches
            .map((match) => match[property] as number)
            .sort((a, b) => a - b);

        const middle = sortedValues.length / 2;
        if (sortedValues.length % 2 === 0) {
            // Even number of matches – take average of two middle elements
            return (sortedValues[middle] + sortedValues[middle - 1]) / 2;
        } else {
            return sortedValues[Math.floor(middle)];
        }
    }

    /** Adds a match to the team */
    addMatches(...matches: T[]) {
        if (matches.some((match) => match.teamNumber !== this.number)) {
            throw new Error(`Matches to be added to team ${this.number} must all be of that team.`);
        }
        this.matches.push(...matches);
    }
}
