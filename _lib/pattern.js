import React from 'react';

const NEWLINE = ';';

export const types = Object.freeze({
    knit: 'k',
    purl: 'p',
    none: 'no stitch'
})

export class Stitch extends React.Component {
    constructor({
        type = types.none,
        next = types.none,
        prev = types.none,
        above = types.none,
        below = types.none
    }) {
        super();
        this.type = type;
        this.next = next;
        this.prev = prev;
        this.above = above;
        this.below = below;
    }

    render() {
        return (
            <>{this.type}</>
        );
    }
}

// KnitPattern is implemented as an array of 'rows'
// where each row is an array of react component 'elements',
// which are objects that have information about that particular stitch
// Each stitch object must know its type and the type of
// stitches above, below, left and right of it,
// and given that information refer to a unique image for 
// those stitches
export class KnitPattern extends React.Component {
    pattern = [[]];

    constructor() {
        super();
    }

    //deep copy of pattern
    mkShalCopy() {
        let duplicateKnitPattern = new KnitPattern();
        duplicateKnitPattern.assignPattern(this.pattern);
        return duplicateKnitPattern;
    }

    // mainly for debug and testing purposes.
    assignPattern(pat) {
        this.pattern = pat;
    }

    // adds a new stitch to the end of the last row of the pattern
    addStitch(typ) {
        let numRows = this.pattern.length;
        this.pattern[numRows - 1].push(new Stitch({ type: typ }));
    }

    // add a new row empty
    addRow() {
        this.pattern.push([]);
    }

    // parses a string representing the text-entered knit pattern,
    // updating this object with the pattern
    parseTextPattern(text = '') {
        function nextChar(arr, index) {
            if ((index + 1) >= arr.length || index < 0) {
                return null;
            } else {
                return arr[index + 1]
            }
        }

        // wipe the current pattern clean
        this.pattern = [[]];

        // read through text char by char.
        let typesVals = Object.values(types);
        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            // if a letter:
            if (/[a-zA-Z]/.test(char)) {
                //is it a type of stitch?
                if (typesVals.includes(char)) {
                    // Add a new stitch to the end of the row
                    this.addStitch(char);

                    // check whether the next character is a number.
                    next = nextChar(text, i);
                    if (/[1-9]/.test(next)) {
                        // if so, add that many stitches -1
                        for (let i = 1; i <= parseInt(next) - 1; i++) {
                            this.addStitch(char);
                        }
                        i++;
                    }
                }
            } else if (char === NEWLINE) {
                //add a new empty row.
                this.addRow();
            }
            // else ignore char.
        }
    }

    // returns the react element that render the
    // pattern
    render() {
        // return a JSX element that is a table and each row
        // is a row of stitches
        // return the rendering of the row given by index
        function Row({ row }) {
            const data = row.map(st => <>{st.render()}</>)
            return (<li>{data}</li>);
        }

        const rows = this.pattern.map(row => <Row row={row} />)

        return (
            // <table>
            //     <tbody>
            //         {rows}
            //     </tbody>
            // </table>
            <ul>
                {rows}
            </ul>
        );
    }
}
