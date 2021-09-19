import minimist from 'minimist';
import {resolve} from 'path';
import * as glob from 'glob';
import Processor from '.';
import {readFileSync, writeFile} from 'fs';

const args = minimist(process.argv.slice(2));

const configFile = args.config ? resolve(args.config) : undefined;
const processor = new Processor(configFile ? require(configFile) : undefined);

const patterns = args._.concat(
    processor.config('extract.include', []) as string[]
);

const matchFiles: string[] = [];
patterns.forEach(pattern =>
    matchFiles.push(
        ...glob.sync(pattern, {
            ignore: processor.config('extract.exclude', []) as string[]
        })
    )
);

function parseClasses(html: string): string[] {
    // Match all class properties
    const output: string[] = [];
    const regex =
        /class(Name)?\s*=\s*{`[^]+`}|class(Name)?\s*=\s*"[^"]+"|class(Name)?\s*=\s*'[^']+'|class(Name)?\s*=\s*[^>\s]+/gim;
    let match;
    while ((match = regex.exec(html))) {
        if (match) {
            const raw = match[0];
            const sep = raw.indexOf('=');
            let value: string | string[] = raw.slice(sep + 1).trim();
            let start =
                match.index +
                sep +
                1 +
                (html.slice(sep + 1).match(/[^'"]/)?.index ?? 0);
            let end = regex.lastIndex;
            let first = value.charAt(0);
            while (['"', "'", '`', '{'].includes(first)) {
                value = value.slice(1, -1);
                first = value.charAt(0);
                end--;
                start++;
            }
            output.push(value);
        }
    }
    return output;
}

let classes = '';

matchFiles.forEach(file => {
    const content = readFileSync(file).toString();
    classes += parseClasses(content).join(' ');
});
const styles = '';
const styleSheet = processor.interpret(classes).styleSheet;
styleSheet.add(...processor.preflight());

writeFile('moonhare.css', styleSheet.build(), () => null);
