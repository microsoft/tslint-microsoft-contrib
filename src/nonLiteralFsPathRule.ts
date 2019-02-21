import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { AstUtils } from './utils/AstUtils';

const PATH_PARAMETER_POSITIONS: { [key: string]: number[] } = {
    appendFile: [0],
    appendFileSync: [0],
    chmod: [0],
    chmodSync: [0],
    chown: [0],
    chownSync: [0],
    createReadStream: [0],
    createWriteStream: [0],
    exists: [0],
    existsSync: [0],
    lchmod: [0],
    lchmodSync: [0],
    lchown: [0],
    lchownSync: [0],
    link: [0, 1],
    linkSync: [0, 1],
    lstat: [0],
    lstatSync: [0],
    mkdir: [0],
    mkdirSync: [0],
    open: [0],
    openSync: [0],
    readdir: [0],
    readdirSync: [0],
    readFile: [0],
    readFileSync: [0],
    readlink: [0],
    readlinkSync: [0],
    realpath: [0],
    realpathSync: [0],
    rename: [0, 1],
    renameSync: [0, 1],
    rmdir: [0],
    rmdirSync: [0],
    stat: [0],
    statSync: [0],
    symlink: [0, 1],
    symlinkSync: [0, 1],
    truncate: [0],
    truncateSync: [0],
    unlink: [0],
    unlinkSync: [0],
    unwatchFile: [0],
    utimes: [0],
    utimesSync: [0],
    watch: [0],
    watchFile: [0],
    writeFile: [0],
    writeFileSync: [0]
};

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'non-literal-fs-path',
        type: 'functionality',
        description: 'Detect calls to fs functions with a non literal filepath',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Mandatory',
        group: 'Security',
        commonWeaknessEnumeration: '22'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        if (tsutils.isCallExpression(node)) {
            if (AstUtils.getFunctionTarget(node) === 'fs' && node.arguments.length > 0) {
                const functionName = AstUtils.getFunctionName(node);
                const positions = PATH_PARAMETER_POSITIONS[functionName];

                if (positions && node.arguments.length >= positions.length) {
                    positions.forEach(position => {
                        const argument = node.arguments[position];

                        if (!tsutils.isStringLiteral(argument)) {
                            fail(AstUtils.getFunctionName(node), argument);
                        }
                    });
                }
            }
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);

    function fail(functionName: string, argument: ts.Expression): void {
        const start: number = argument.getStart();
        const width: number = argument.getWidth();
        const message: string = `Non-literal (insecure) path passed to fs.${functionName}: ${argument.getText()}`;

        ctx.addFailureAt(start, width, message);
    }
}
