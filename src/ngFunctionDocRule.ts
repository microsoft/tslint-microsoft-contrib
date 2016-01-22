// /// <reference path='../node_modules/tslint/typings/node/node.d.ts'/>
// /// <reference path='../node_modules/typescript/lib/typescript.d.ts' />
// /// <reference path='../node_modules/tslint/lib/tslint.d.ts' />
// name:custom tslint rule for no good function documents
// Copyright (C) 2015 All Rights Reserve.
// licence under MPL.1.1 : http://www.mozilla-japan.org/MPL/MPL-1.1J.html
//

import * as ts from  'typescript';
//import * as ts from   'tslint/node_modules/typescript/lib/typescript';
import * as Lint from 'tslint/lib/lint'; // >=version 3.
import SyntaxKind = require('./utils/SyntaxKind');
import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING0 = 'failed to verify Function document:';
    public static FAILURE_STRING1 = 'missing documents ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        //var documentRegistry = ts.createDocumentRegistry();
        //var languageServiceHost = Lint.createLanguageServiceHost(sourceFile.fileName, sourceFile.getFullText());
        //var curLanguageService: ts.LanguageService = ts.createLanguageService(languageServiceHost, documentRegistry);
        return this.applyWithWalker(new NgFunctionDocWalker(sourceFile, this.getOptions()));
    }
}

class NgFunctionDocWalker extends ErrorTolerantWalker /*Lint.RuleWalker*/ {
    //private curLanguageService: ts.LanguageService; //this.lang
    //private curTypeChecker: ts.TypeChecker; too slow !!
    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        //this.curLanguageService = curLanguageService;
        //this.curTypeChecker = this.curLanguageService.getProgram().getTypeChecker();
        //const program = ts.createProgram([sourceFile.fileName], Lint.createCompilerOptions());
        //this.curTypeChecker = program.getTypeChecker();  //!!! this step is too-slow
    }
    private getLeadingCommentString(curNode: ts.Node): string {
        var p: string = '';
        if (!(!curNode)) {
            var sourceFile: ts.SourceFile = this.getSourceFile();
            var comments: ts.CommentRange[] = ts.getLeadingCommentRanges(sourceFile.text, curNode.pos);
            if (!(!comments)) {
                for (var i: number = 0; i < comments.length; i++) {
                    var curText = sourceFile.text.slice(comments[i].pos, comments[i].end);
                    if (curText.match(/^\s*\/\*\*[^\/]/)) { p = ''; } //最後のjsDocのみ残す
                    curText = curText.replace(/^\s*\/\/+\s*|^\s*\/\*+[\t ]*/, '').replace(/[\t ]{2,}\*[\t \*]*\/?/g, '').replace(/<[bB][rR]>/g, '').trim();
                    if (curText.length > 0) {
                        p += curText + '\n';
                    }
                }
                if (p.length > 0) { p = '/**\n' + p; /* jsdocではなかった場合、ヘッダコメント追加 */ }
            }
        }
        return p;
    }
    private getTrailingCommentString(curNode: ts.Node): string {
        var p: string = '';
        if (!(!curNode)) {
            var comments: ts.CommentRange[] = ts.getTrailingCommentRanges(this.getSourceFile().text, curNode.pos);
            if (!(!comments)) {
                for (var i: number = 0; i < comments.length; i++) {
                    var curText = this.getSourceFile().text.slice(comments[i].pos, comments[i].end);
                    if (curText.match(/^\s*\/\*\*[^\/]/)) { p = ''; } //最後のjsDocのみ残す
                    curText = curText.replace(/^\s*\/\/+\s*|^\s*\/\*+[\t ]*/, '').replace(/[\t ]{2,}\*[\t \*]*\/?/g, '').replace(/<[bB][rR]>/g, '').trim();
                    if (curText.length > 0) {
                        p += curText + '\n';
                    }
                }
                if (p.length > 0) { p = '/**\n' + p; /* jsdocではなかった場合、ヘッダコメント追加*/ }
            }
        }
        return p;
    }
    private getNeedsComments(parameters: ts.NodeArray<ts.ParameterDeclaration>, retType: ts.TypeNode, o: string[]): string[] {
        var r: string[] = [];
        for (var i = 0; i < parameters.length; i++) {
            r.push('(@param)?\\W+' + parameters[i].name.getText() + ' *\\W+');
        }
        if (!(!retType)) {
            var retTypeStr: string = retType.getText();
            if (retTypeStr !== 'void') { r.push('@return '); }
        } else { r.push('@return void'); }
        if (o.length > 0) { r = r.concat(o); }
        return r;
    }
    private verifyNeededComments(node: ts.Node, nodeType: string, nameStr: string, pastComments: string, needsComments: string[]): void {
        var err: string = '';
        if (needsComments.length > 0) {
            var p: string = pastComments.trim();
            if (p.length > 0) { pastComments.replace(/[Ss][Tt][Rr][Ii][Nn][Gg]/g, 'string').replace(/{[Oo][Bb][Jj][Ee][Cc][Tt]}/g, '{Object}'); }
            for (var i: number = 0; i < needsComments.length; i++) {
                if (!(p.match(needsComments[i]))) { err += needsComments[i] + ' !! missing description.\n'; }
            }
        }
        if (err.length > 0) {
            this.addFailure(this.createFailure(node.getFullStart(), node.getFullWidth(), Rule.FAILURE_STRING1 + nodeType + ' @name ' + nameStr + '\n' + err + pastComments + '\n **/\n'));
        } else { ; }
    }
    public visitArrowFunction(node: ts.FunctionLikeDeclaration) {
        try {
            var needComments: string[] = this.getNeedsComments(node.parameters, node.type, ['@event']);
            if (node.parent.kind === SyntaxKind.current().PropertyAssignment) {
                this.verifyNeededComments(node.parent, 'PropertyAssignment-ArrowFunction', (<ts.PropertyAssignment>node.parent).name.getText(),
                    this.getLeadingCommentString(node.parent) + this.getLeadingCommentString(node), needComments);
            } else if (node.parent.kind === SyntaxKind.current().VariableDeclaration) {
                this.verifyNeededComments(node.parent, 'VariableDeclaration-ArrowFunction', (<ts.VariableDeclaration>node.parent).name.getText(),
                    this.getLeadingCommentString(node.parent.parent) + this.getLeadingCommentString(node.parent) + this.getLeadingCommentString(node), needComments);
            } else if (node.parent.kind === SyntaxKind.current().BinaryExpression && (<ts.BinaryExpression>node.parent).operatorToken.getText() === '=' /*&& (<ts.BinaryExpression>node.parent).right === <ts.???>node*/) {
                this.verifyNeededComments(node.parent, 'let-ArrowFunction', (<ts.BinaryExpression>node.parent).left.getText(),
                    this.getLeadingCommentString(node.parent.parent) + this.getLeadingCommentString(node.parent) + this.getLeadingCommentString(node), needComments);
            } else { ; }
        } catch (ex) {
            this.addFailure(this.createFailure(node.getFullStart(), node.getFullWidth(), Rule.FAILURE_STRING0 + ' ArrowFunction ' + ex + '\n' + node.getFullText()));
        }
        super.visitArrowFunction(node);
    }
    public visitFunctionExpression(node: ts.FunctionExpression) {
        try {
            var needComments: string[] = this.getNeedsComments(node.parameters, node.type, ['@event']);
            if (node.parent.kind === SyntaxKind.current().PropertyAssignment) {
                this.verifyNeededComments(node.parent, 'PropertyAssignment-FunctionExpression', (<ts.PropertyAssignment>node.parent).name.getText(),
                    this.getLeadingCommentString(node.parent) + this.getLeadingCommentString(node), needComments);
            } else if (node.parent.kind === SyntaxKind.current().VariableDeclaration) {
                this.verifyNeededComments(node.parent, 'VariableDeclaration-FunctionExpression', (<ts.VariableDeclaration>node.parent).name.getText(),
                    this.getLeadingCommentString(node.parent.parent) + this.getLeadingCommentString(node.parent) + this.getLeadingCommentString(node), needComments);
            } else if (node.parent.kind === SyntaxKind.current().BinaryExpression && (<ts.BinaryExpression>node.parent).operatorToken.getText() === '=' && (<ts.BinaryExpression>node.parent).right === <ts.Expression>node) {
                this.verifyNeededComments(node.parent, 'let-FunctionExpression', (<ts.BinaryExpression>node.parent).left.getText(),
                    this.getLeadingCommentString(node.parent.parent) + this.getLeadingCommentString(node.parent) + this.getLeadingCommentString(node), needComments);
            } else { ; }
        } catch (ex) {
            this.addFailure(this.createFailure(node.getFullStart(), node.getFullWidth(), Rule.FAILURE_STRING0 + ' FunctionExpression ' + ex + '\n' + node.getFullText()));
        }
        super.visitFunctionExpression(node);
    }
    public visitFunctionDeclaration(node: ts.FunctionDeclaration) {
        try {
            var needComments: string[] = this.getNeedsComments(node.parameters, node.type, ['@event']);
            this.verifyNeededComments(node, 'FunctionDeclaration', node.name.getText(), this.getLeadingCommentString(node), needComments);
        } catch (ex) {
            this.addFailure(this.createFailure(node.getFullStart(), node.getFullWidth(), Rule.FAILURE_STRING0 + ' FunctionDeclaration ' + ex + '\n' + node.getFullText()));
        }
        super.visitFunctionDeclaration(node);
    }
    public visitMethodDeclaration(node: ts.MethodDeclaration) {
        try {
            var needComments: string[] = this.getNeedsComments(node.parameters, node.type, []);
            this.verifyNeededComments(node, 'MethodDeclaration', node.name.getText(), this.getLeadingCommentString(node), needComments);
        } catch (ex) {
            this.addFailure(this.createFailure(node.getFullStart(), node.getFullWidth(), Rule.FAILURE_STRING0 + ' MethodDeclaration ' + ex + '\n' + node.getFullText()));
        }
        super.visitMethodDeclaration(node);
    }
    public visitMethodSignature(node: ts.SignatureDeclaration) {
        try {
            var needComments: string[] = this.getNeedsComments(node.parameters, node.type, []);
            this.verifyNeededComments(node, 'MethodSignature', node.name.getText(), this.getLeadingCommentString(node), needComments);
        } catch (ex) {
            this.addFailure(this.createFailure(node.getFullStart(), node.getFullWidth(), Rule.FAILURE_STRING0 + ' MethodSignature ' + ex + '\n' + node.getFullText()));
        }
        super.visitMethodSignature(node);
    }
}
