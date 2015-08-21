
import BannedTermWalker = require('./BannedTermWalker');

export class Rule extends Lint.Rules.AbstractRule {
    private static FAILURE_STRING = 'Forbidden reference to banned term: ';
    private static BANNED_TERMS : string[] = [ 'caller', 'callee', 'arguments', 'eval' ];

    public apply(sourceFile : ts.SourceFile): Lint.RuleFailure[] {
        var walker : Lint.RuleWalker = new BannedTermWalker(
            sourceFile,
            this.getOptions(),
            Rule.FAILURE_STRING,
            Rule.BANNED_TERMS
        );
        return this.applyWithWalker(walker);
    }
}

