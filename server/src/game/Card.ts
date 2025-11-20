export enum Suit {
    Hearts = 'Hearts',
    Diamonds = 'Diamonds',
    Clubs = 'Clubs',
    Spades = 'Spades',
}
export enum Rank {
    Two = '2',
    Three = '3',
    Four = '4',
    Five = '5',
    Six = '6',
    Seven = '7',
    Eight = '8',
    Nine = '9',
    Ten = '10',
    Jack = 'J',
    Queen = 'Q',
    King = 'K',
    Ace = 'A',
}
export class Card {
    constructor(public suit: Suit, public rank: Rank) {}

    toString(): string {
        return `${this.rank} ${this.suit.charAt(0).toUpperCase() }`;
    }
    getValue(): number {
        const values: { [key : string]: number } = {
            '2': 2,
            '3': 3,
            '4': 4,
            '5': 5,
            '6': 6,
            '7': 7,
            '8': 8,
            '9': 9,
            '10': 10,
            'J': 11,
            'Q': 12,
            'K': 13,
            'A': 14,
        };
        return values[this.rank];
    }
    static fromString(str: string): Card {
        const rank = str[0] as Rank;
        const suitMap: { [key: string]: Suit } = {
            'H': Suit.Hearts,
            'D': Suit.Diamonds,
            'C': Suit.Clubs,
            'S': Suit.Spades,
        };
        const suit = suitMap[str[1].toUpperCase()];
        return new Card(suit, rank);
    }
}