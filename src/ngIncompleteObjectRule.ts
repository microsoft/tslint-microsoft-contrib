// /// <reference path='../node_modules/tslint/typings/node/node.d.ts'/>
// /// <reference path='../node_modules/typescript/lib/typescript.d.ts' />
// /// <reference path='../node_modules/tslint/lib/tslint.d.ts' />

        /*! *****************************************************************************
          this code is modified from typescript.js and tslint-microsoft-contrib code.
            Copyright (c) Microsoft Corporation. All rights reserved.
            
            
          mofifyed progrm name is :No good Incomplete Object Rule.
          Licence is  MPL1.1: Mozilla Public License Version 1.1
                  https://www.mozilla.org/en-US/MPL/1.1
                  in "Initial Developer" is reversi.fun and typescript.js Developer
                   or tslint-microsoft-contrib Developer.
                  It means "Mine(=Initial Developer) is mine, Your things also mine",
                  except "Initial Developer".
            Copyright (c) 2016 reversi.fun. All rights reserved.
        ******************************************************************************/

import * as ts from 'typescript';
//import * as ts from  "../node_modules/typescript/lib/typescript";
import * as Lint from 'tslint/lib/lint';
//import * as Lint from "../node_modules/tslint/lib/lint"; // >=version 3.

import ScopedSymbolTrackingWalker = require('./utils/ScopedSymbolTrackingWalker');
import SyntaxKind = require('./utils/SyntaxKind');
import AstUtils = require('./utils/AstUtils');
//var traceLogger = { error: (msg, obj?) => { }, warn: (msg, obj?) => { }, debug: (msg, obj?) => { console.log(msg); }, trace: (msg, obj?) => { console.log(msg); } };// log4js like nop logger
var traceLogger = { error: (msg, obj?) => { }, warn: (msg, obj?) => { }, debug: (msg, obj?) => { }, trace: (msg, obj?) => { } };// release level logger ,log4js like
var errorLogger = { error: (msg, obj?) => { console.error(msg); }, warn: (msg, obj?) => { } }; // nop Logger
/**
 * Implementation of the "ngIncompleteObject" rule.
 */
/* tslint:disable:no-console */
interface RuleOption{
    callNames: string[];
    exceptNames: string[];
    valueExpand: boolean;
    checkVauge: boolean;
};
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING1 = 'Incomplete property Object at calling '; // for callExpression : object value
    public static FAILURE_STRING2 = 'Vauge property Object at calling '; // for callExpression : object value

    // @event each sourceFile
    // @return  RuleFailure[]
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        var ruleArguments: any[] = this.getOptions().ruleArguments;
        var ruleOption: RuleOption = <RuleOption>{ callNames: [], exceptNames: [], valueExpand: true ,checkVauge: true};
        for (var i = 0; i < ruleArguments.length; i++) {
            if (typeof (ruleArguments[i]) === "object") {
                if (!(!ruleArguments[i]['callNames'])) {
                    for (var e = 0; e < ruleArguments[i].callNames.length; e++) {
                        if (typeof (ruleArguments[i].callNames[e]) === "string" && (ruleArguments[i].callNames[e].length > 0)) {
                            ruleOption.callNames.push(ruleArguments[i].callNames[e]);
                            traceLogger.debug("!!# ruleOption.callNames.push(" + ruleArguments[i].callNames[e] + ")");
                        } else {
                            errorLogger.error("invalid callNames:", ruleArguments[i]);
                        }
                    }
                }
                if (!(!ruleArguments[i]['exceptNames'])) {
                    for (var e = 0; e < ruleArguments[i].exceptNames.length; e++) {
                        if (typeof (ruleArguments[i].exceptNames[e]) === "string" && (ruleArguments[i].exceptNames[e].length > 0)) {
                            ruleOption.exceptNames.push(ruleArguments[i].exceptNames[e]);
                            traceLogger.debug("!!# ruleOption.exceptNames.push(" + ruleArguments[i].exceptNames[e] + ")");
                        } else {
                            errorLogger.error("invalid exceptNames:", ruleArguments[i]);
                        }
                    }
                }
                if (typeof (ruleArguments[i]['valueExpand']) === "undefine") {
                    if (typeof (ruleArguments[i]['valueExpand']) === "boolean") {
                        if (ruleArguments[i].valueExpand === true) { ruleOption.valueExpand = true; }
                        else if (ruleArguments[i].valueExpand === false) { ruleOption.valueExpand = false; }
                        traceLogger.debug("!!# ruleOption.valueExpand =" + ruleOption.valueExpand);
                    } else {
                        errorLogger.error("invalid valueExpand:", ruleArguments[i]);
                    }
                }
                if (typeof (ruleArguments[i]['checkVauge']) === "undefine") {
                    if (typeof (ruleArguments[i]['checkVauge']) === "boolean") {
                        if (ruleArguments[i].checkVauge === true) { ruleOption.checkVauge = true; }
                        else if (ruleArguments[i].checkVauge === false) { ruleOption.checkVauge = false; }
                        traceLogger.debug("!!# ruleOption.CheckVauge =" + ruleOption.checkVauge);
                    } else {
                        errorLogger.error("invalid checkVauge:", ruleArguments[i]);
                    }
                }
            }
        }
        if (ruleOption.callNames.length <= 0) {
            return null; // disable rule exit
        }
        var compilerOptions: ts.CompilerOptions;
        compilerOptions = Lint.createCompilerOptions();
        compilerOptions.module = ts.ModuleKind.CommonJS;
        compilerOptions.noResolve = false;
        compilerOptions = <ts.CompilerOptions>{ /*noEmitOnError: true, noImplicitAny: true,*/ target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS, noResolve: false };
        var curProgram: ts.Program = ts.createProgram([sourceFile.fileName], compilerOptions);
        var curTypeChecker: ts.TypeChecker = curProgram.getTypeChecker();
        var documentRegistry: ts.DocumentRegistry = ts.createDocumentRegistry();
        var languageServiceHost: ts.LanguageServiceHost = Lint.createLanguageServiceHost(sourceFile.fileName, sourceFile.getFullText());
        var languageService: ts.LanguageService = ts.createLanguageService(languageServiceHost, documentRegistry);
        //return this.applyWithWalker(new AngularJSIncompleteObjectWalker(sourceFile, this.getOptions(), languageService , curTypeChecker));
        //return this.applyWithWalker(new AngularJSIncompleteObjectWalker(languageService.getSourceFile(sourceFile.fileName) /*sourceFile*/, this.getOptions(), languageService , curTypeChecker));
        return this.applyWithWalker(new NoIncompleteObjectWalker(curProgram.getSourceFile(sourceFile.fileName), this.getOptions(), languageService, curTypeChecker, ruleOption));
    }
};

var myContext: myContextClass;
var myTsExprEval: MyTsExprEval;
var curTypeChecker : ts.TypeChecker;
var myTsAst2Xref: MyTsAst2XrefClass;
class NoIncompleteObjectWalker extends ScopedSymbolTrackingWalker /*Lint.RuleWalker*/ {
    //protected languageServices: ts.LanguageService;
    //protected typeChecker : ts.TypeChecker;
    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions, languageService: ts.LanguageService , TypeChecker: ts.TypeChecker, ruleOption: RuleOption) {
        super(sourceFile, options, languageService);
        //this.languageServices = languageService;
        this.typeChecker = TypeChecker;
        curTypeChecker = TypeChecker;
        myContext = new myContextClass(); myContext.clear();
        myTsExprEval = new MyTsExprEval();
        myTsExprEval.exceptNames = ruleOption.exceptNames;
        myTsAst2Xref = new MyTsAst2XrefClass();
        myTsAst2Xref.curRuleWorker = this;  // set output callback
        myTsAst2Xref.callNames = ruleOption.callNames;  // set check target
        myTsAst2Xref.valueExpand = ruleOption.valueExpand;  // set output value expression option
        myTsAst2Xref.checkVauge = ruleOption.checkVauge;  // set Check Vauge select option 
        
    }
    /* tslint:disable:no-console */
    protected visitNode(node: ts.Node): void {
        traceLogger.trace("!!##visitNode " + (<any>ts).SyntaxKind[node.kind] + ' :: ' /*+ node.getText()*/);
        myContext.push(node.kind);
        myContext.updateLineAndCharacter(this.getSourceFile().getLineAndCharacterOfPosition(node.pos));
        super.visitNode(node);
        myContext.pop(node.kind);
    }

    protected visitSourceFile(node: ts.SourceFile): void {
        myContext.gFileName = node.fileName;
        traceLogger.trace("!!filename=" + myContext.gFileName);
        traceLogger.debug("node.referencedFiles");
        for (var i: number = 0; i < node.referencedFiles.length; i++) {
            traceLogger.debug(node.referencedFiles[i]);
        }
        super.visitSourceFile(node);
    }
    protected visitIdentifier(node: ts.Identifier): void {
        if (false && node.kind === SyntaxKind.current().Identifier) {
            AstUtils.dumpTypeInfo(node, this.languageServices, this.typeChecker);
        }
        var curName:string = node.getText();
        if(["__type","__value","__vague","__PickUp"].indexOf(curName) >=0){
        	throw new Error("Not supports var name as same name of this RuleWorker.");
        }
        var parentNode: ts.Node = node.parent;
        if (parentNode.kind === ts.SyntaxKind.ClassDeclaration) {
            myTsAst2Xref.rem_define_TsClass(<ts.Identifier>node,<ts.ClassDeclaration>parentNode,"TS.Class");
        } else if (parentNode.kind === ts.SyntaxKind.InterfaceDeclaration) {
            myTsAst2Xref.rem_define_TsClass(<ts.Identifier>node,<ts.InterfaceDeclaration>parentNode,"TS.Interface");
        //} else if (parentNode.kind === ts.SyntaxKind.MethodDeclaration || parentNode.kind === ts.SyntaxKind.MethodSignature) {
        //    myTsAst2Xref.rem_TS_MethodDefined(<ts.Identifier>node,<ts.Declaration>parentNode);
        } else if (parentNode.kind === ts.SyntaxKind.PropertySignature || parentNode.kind === ts.SyntaxKind.PropertyDeclaration || parentNode.kind === ts.SyntaxKind.PropertyAssignment || parentNode.kind === ts.SyntaxKind.GetAccessor) {
            myTsAst2Xref.rem_TS_PropertyDefined(<ts.Identifier>node,<ts.Declaration>parentNode);
        } else if (parentNode.kind === ts.SyntaxKind.Parameter) {
            myTsAst2Xref.rem_define_Parameter(<ts.ParameterDeclaration>parentNode,parentNode.parent); 
        } else if (parentNode.kind === ts.SyntaxKind.VariableDeclaration) {
            myTsAst2Xref.rem_TS_VariableDeclaration_initValue(<ts.Identifier>node, (<ts.VariableDeclaration>parentNode).initializer);
        } else {;}
        super.visitIdentifier(node);
    }
    protected visitPropertyDeclaration(node: ts.PropertyDeclaration): void {
        if(node.name.getText() === "$inject" && !(!node.initializer) && node.initializer.kind === ts.SyntaxKind.ArrayLiteralExpression){
            myTsAst2Xref.pre_$inject(<ts.Identifier>node.name,<ts.ArrayLiteralExpression>(node.initializer), 0);
        }
        super.visitPropertyDeclaration(node);
    }
    protected visitBinaryExpression(node: ts.BinaryExpression): void {
        super.visitBinaryExpression(node);
        myTsAst2Xref.rem_BinaryExpression(<ts.BinaryExpression>node);
    }
    protected visitCallExpression(node: ts.CallExpression): void{
        super.visitCallExpression(node);
        myTsAst2Xref.rem_CallLikeExpression(node.expression, node.arguments); 
    }
    /* tslint:enable:no-console */
}
class conTextStackItem {  // SCOPE context
    conTextType: ts.SyntaxKind = ts.SyntaxKind.Unknown;
    id: string = "";
    //valRef: string[][];
    values: string[][];
    seq: number;
    constructor(conTextType: ts.SyntaxKind, id: string = "", seq: number = 0) {
        this.conTextType = conTextType;
        this.id = id;
        //        this.valRef = [];
        this.values = [];
        this.seq = seq;
    };
};
class myContextClass {
    gFileName:string;
    conTextStack: conTextStackItem[] = []; // TypeScript context stack
    tsGblConText = { moduleName: "", classIfName: "", methodName: "", classIfType: "" }; // typeScript context stack
    lineAndCharacter:ts.LineAndCharacter ;
    clear() {
        "use strict";
        this.lineAndCharacter = <ts.LineAndCharacter>{line:0, character : 0};
        if (!(!this.conTextStack[0])) {
            var conTextStack1Backup: conTextStackItem = this.conTextStack[0];
            this.conTextStack = [];
            this.conTextStack.push(conTextStack1Backup);
        } else {
            this.conTextStack = [];
        }
        this.tsGblConText.moduleName = "";
        this.tsGblConText.classIfName = "";
        this.tsGblConText.classIfType = "";
        this.tsGblConText.methodName = ""; // method or class property name
    };
    updateLineAndCharacter(newLineAndCharacter:ts.LineAndCharacter){
        this.lineAndCharacter = newLineAndCharacter;
    };
    getLineAndCharacter():string {
        return (this.lineAndCharacter.line + 1 + ((this.lineAndCharacter.character + 1) / 100000)).toFixed(5);
    }
    isBlock(tn: ts.SyntaxKind): boolean {
        "use strict";
        return (tn === ts.SyntaxKind.SourceFile || tn === ts.SyntaxKind.ModuleDeclaration ||
            tn === ts.SyntaxKind.FunctionExpression || tn === ts.SyntaxKind.FunctionType || tn === ts.SyntaxKind.ArrowFunction ||
            tn === ts.SyntaxKind.MethodDeclaration || tn === ts.SyntaxKind.MethodSignature ||
            tn === ts.SyntaxKind.Constructor || tn === ts.SyntaxKind.GetAccessor /*Method*/ ||
            tn === ts.SyntaxKind.ClassDeclaration || tn === ts.SyntaxKind.InterfaceDeclaration ||
            //tn === ts.SyntaxKind.PropertySignature || tn === ts.SyntaxKind.PropertyDeclaration || //classのPropertyをclassに従属させるため
            // tn === ts.SyntaxKind.ForStatement || tn === ts.SyntaxKind.ForInStatement ||
            // tn === ts.SyntaxKind.Block || javascriptではbolckスコープの変数は無く、typeScriptではBlock間でSymbol属性の統一性が強制される
            tn === ts.SyntaxKind.ObjectLiteralExpression);
    };
    isInConstructor():boolean{
        return (this.conTextStack.length > 1 && !(!this.conTextStack[this.conTextStack.length - 1]["conTextType"]) && this.conTextStack[this.conTextStack.length - 1].conTextType === ts.SyntaxKind.Constructor) ||
         (this.conTextStack.length > 2 && !(!this.conTextStack[this.conTextStack.length - 2]["conTextType"]) && this.conTextStack[this.conTextStack.length - 2].conTextType === ts.SyntaxKind.Constructor);
    };
    push(tn: ts.SyntaxKind) {
        "use strict"; // push (type)
        if (this.isBlock(tn)) {
            this.conTextStack.push(new conTextStackItem(tn));
            traceLogger.trace("!!##conText.push " + (<any>ts).SyntaxKind[tn]);
            if (this.conTextStack.length > 1) {
                this.conTextStack[this.conTextStack.length - 1].seq = 0;
                this.conTextStack[this.conTextStack.length - 2].seq = this.conTextStack[this.conTextStack.length - 2].seq + 1;
            }
        }
    };
    pop(tn) {
        "use strict";
        if (this.isBlock(tn)) {
            var pastType = this.conTextStack.pop().conTextType;
            if (pastType !== tn) {traceLogger.warn("##! error block type stack conflict!## " + tn + "!=" + pastType);}
        }
    };
    setType(tn: ts.SyntaxKind) {
        "use strict";
        if (this.conTextStack.length <= 0) {
            this.push(tn);
        } else {
            this.conTextStack[0].conTextType = tn;
        }
    };
    convertSymbol2Name(valSymbols: string[]): {className:string, methodName:string} {
        var valName: {className:string, methodName:string} = {className:"", methodName:""};
        if (valSymbols.length === 1) { valName = {className:valSymbols[0], methodName:""}; }
        else if (valSymbols.length > 1) {
            valName.className = valSymbols[0];
            valName.methodName = valSymbols[valSymbols.length - 1];
            for (var i: number = 1; i < valSymbols.length - 1; i++) {
                if (valSymbols[i][0] !== "[") {valName.className += ".";}
                valName.className += valSymbols[i];
            }
        }
        return valName;
    };
    convertSymbol2NameStr(valName: {className:string, methodName:string} ): string {
        return valName.className + ((valName.methodName.length > 0 && valName.methodName[0] !== "[") ? "." : "") + valName.methodName;
    };
    getValSymbols(rvalSymbols: string[]): any {// get value for symbols list
        "use strict";
        var valName:  {className:string, methodName:string} = this.convertSymbol2Name(rvalSymbols);
        traceLogger.debug("!!!!## getValSymbol called :" + this.convertSymbol2NameStr(valName));
        var curValContextLevel: number, i: number;
        var objs: any = undefined;
        if (rvalSymbols[0][0] === "$") { // $scope,$log etc
            curValContextLevel = 0; //sourceFile level scope
            objs = this.conTextStack[curValContextLevel].values[rvalSymbols[0]];
        } else {
            curValContextLevel = this.conTextStack.length - 1;
            //rootSymbol = rvalSymbols[0];
            for (; curValContextLevel >= 0; curValContextLevel--) {
                if (!(!this.conTextStack[curValContextLevel].values[rvalSymbols[0]])) {
                    objs = this.conTextStack[curValContextLevel].values[rvalSymbols[0]];
                    break;
                }
            }
            if ((!objs)) {// not exist
                curValContextLevel = this.conTextStack.length - 1;
                objs = this.conTextStack[curValContextLevel].values[rvalSymbols[0]]; // set undefinded
            } else if (typeof (objs) === "function") { // push or others
                curValContextLevel = this.conTextStack.length - 1;
                objs = undefined;
            }
        }
        // debug traceLogger.debug("!!!!## debug getValSymbols #1 objs=");
        // debug dump */ traceLogger.debug(objs);

        if (!(!objs)) { //exist rootSymbol
            var curVague:boolean = false;
            for (i = 1; i < rvalSymbols.length; i++) {
                if ((["length","concat"].indexOf(rvalSymbols[i]) >=0) || (typeof("string"[rvalSymbols[i]]) === "function") || (typeof(["array"][rvalSymbols[i]]) === "function")) {break;}
                else if (!(!objs[rvalSymbols[i]])) {objs = objs[rvalSymbols[i]];}
                else if (!(!objs["[\"" + rvalSymbols[i] + "\"]" ])) {objs = objs["[\"" + rvalSymbols[i] + "\"]" ];}
                else if (!(!objs["[" + rvalSymbols[i] + "]" ])) {objs = objs["[" + rvalSymbols[i] + "]" ];}
                else {
                    var elementID :string = rvalSymbols[i];
                    if(elementID.length >2 && elementID[0] === "[" && elementID.slice(-1) === "]") {elementID = elementID.slice(1,-1);}
                    if(elementID.length >2 && elementID[0] === "\"" && elementID.slice(-1) === "\"") {elementID = elementID.slice(1,-1);}
                    if(elementID.length >2 && elementID[0] === "\'" && elementID.slice(-1) === "\'") {elementID = elementID.slice(1,-1);}
                    if ((elementID[0] === "[")){
                        traceLogger.trace("!!!!## debug getValSymbols elements access " + rvalSymbols[i] + " type=" + typeof(objs) + " isArray=" + (objs instanceof Array) + "eval=" + (objs[rvalSymbols[i]]) );
                        // debug dump traceLogger.trace(objs);
                    }
                    if (!(!objs[elementID])) {objs = objs[elementID];}
                    else {break;}
                }
            }
            // debug traceLogger.debug("!!!!## debug getValSymbols #2: i=" + i +"<>" + rvalSymbols.length + " ,objs=" + typeof(objs));
            // debug dump */ traceLogger.debug(objs);
            if (i >= rvalSymbols.length && !(!objs)) {
                if ((objs instanceof Array) || (typeof(objs) !== "object")){
                    objs = { __PickUp: false, __value: objs, __vague: false, __type: "" };
                } else {
                }
                /*debug*/ traceLogger.debug("!!!!## debug getValSymbols #3: returns {__PickUp:" + objs.__PickUp + ",__type:" + objs.__type + "::" + typeof (objs.__value) + (objs.__value instanceof Array ? " Array" : "") + ",__value:", objs);
                return objs; // Main return objs,string/number/boolean/Array
            } else if (!(!objs)) {
                var objStr = myTsExprEval.toSourceV(objs);
                if ((objStr[0] === "{" || objStr.slice(-1) ===  "}" || objStr.slice(-3) ===  "|} " || (objStr.length <= 2)) || (objStr.length > 3900)) {
                    if((i > 1) && (typeof(this.conTextStack[curValContextLevel].values[rvalSymbols[0]][rvalSymbols[1]]) === "string")){
                        var objStr = <string>this.conTextStack[curValContextLevel].values[rvalSymbols[0]][rvalSymbols[1]];
                        i = 2;
                    } else if(i > 1 && (typeof(this.conTextStack[curValContextLevel].values[rvalSymbols[0]][rvalSymbols[1]]) === "object") && (!(!this.conTextStack[curValContextLevel].values[rvalSymbols[0]][rvalSymbols[1]]["__value"])) && (typeof(this.conTextStack[curValContextLevel].values[rvalSymbols[0]][rvalSymbols[1]]["__value"]) === "string")){
                        var objStr = <string>this.conTextStack[curValContextLevel].values[rvalSymbols[0]][rvalSymbols[1]].__value;
                        i = 2;
                    } else if(i > 1 && (typeof(this.conTextStack[curValContextLevel].values[rvalSymbols[0]][rvalSymbols[1]]) === "object") && (!(!this.conTextStack[curValContextLevel].values[rvalSymbols[0]][rvalSymbols[1]]["__value"])) && (typeof(this.conTextStack[curValContextLevel].values[rvalSymbols[0]][rvalSymbols[1]]["__value"][0]) === "string")){
                        var objStr = <string>this.conTextStack[curValContextLevel].values[rvalSymbols[0]][rvalSymbols[1]].__value[0];
                        i = 2;
                    } else {
                        var objStr = rvalSymbols[0];
                        i = 1;
                    }
                }
            } else {
                var objStr = rvalSymbols[0];
                i = 1;
            }
        } else {
            objStr = rvalSymbols[0];
            i = 1;
        }
        for (; i < rvalSymbols.length; i++) {
            if (rvalSymbols[i][0] !== "[") {objStr += ".";}
            objStr += rvalSymbols[i];
        }
        /*debug */    traceLogger.trace("### getValSymbol return unresolved value :" + objStr);
        return {__PickUp:false, __value:objStr, __vague:curVague, __type:""};
    };
    setValSymbols2AnyValG(lValSymbols: string[], rValObject: any) { // for function arguments,valiable-declare
        "use strict";
        var curValContextLevel: number = 0;
        var toBePickup: boolean = true ;
        //
        if (lValSymbols.length === 0 || lValSymbols[0].length === 0) {
            myContext.exitError("##!! error in expreession setValSymbols2AnyValG lValSymbols=" + lValSymbols );
        }
        if (lValSymbols[0].length >= 2 && lValSymbols[0][0] === "\"" && lValSymbols[0].slice(-1) === "\"") {lValSymbols[0] = "'" + lValSymbols[0].slice(1, -1) + "'";}
        var rValObjectVal = {__PickUp:toBePickup,__value:null,__vague:false,__type:""};
        if (!(!rValObject) &&
             (  ((typeof(rValObject) === "object") && (rValObject instanceof Array))
             ||((typeof(rValObject) !== "object") )
             ) ) {
            rValObjectVal.__value = rValObject;
        } else if(!(!rValObject) && (typeof(rValObject) === "object")) {
            rValObjectVal = rValObject;
            if(!rValObjectVal["__PickUp"]) {rValObjectVal["__PickUp"] = toBePickup;}
        }else { // null/undefine
            rValObjectVal.__value = rValObject;
        }
        /*debug*/     traceLogger.debug(" ### setValSymbols2AnyValG called :" + lValSymbols);
        //object dump traceLogger.trace(lValSymbols); traceLogger.trace(rValObjectVal);
        if (lValSymbols[0][0] === "\"" && lValSymbols[0].slice(-1) === "\"") {lValSymbols[0] = "'" + lValSymbols[0].slice(1, -1) + "'";}
        if (lValSymbols.length >= 1) {
            if ((!this.conTextStack[curValContextLevel].values[lValSymbols[0]])
                 || typeof (this.conTextStack[curValContextLevel].values[lValSymbols[0]]) !== "object")
                 {this.conTextStack[curValContextLevel].values[lValSymbols[0]] = {__PickUp:toBePickup };}
            if(!(!this.conTextStack[curValContextLevel].values[lValSymbols[0]].__PickUp)) {rValObjectVal.__PickUp = true;}
            if (lValSymbols.length === 1) {
                for (var e in rValObjectVal) {this.conTextStack[curValContextLevel].values[lValSymbols[0]][e] = rValObjectVal[e];}
            } else if (lValSymbols.length >= 2) {
                if ((!this.conTextStack[curValContextLevel].values[lValSymbols[0]][lValSymbols[1]])
                     || typeof (this.conTextStack[curValContextLevel].values[lValSymbols[0][lValSymbols[1]]]) !== "object")
                     {this.conTextStack[curValContextLevel].values[lValSymbols[0]][lValSymbols[1]] = {__PickUp:toBePickup };}
                if (lValSymbols.length === 2) {
                    for (var e in rValObjectVal) {this.conTextStack[curValContextLevel].values[lValSymbols[0]][lValSymbols[1]][e] = rValObjectVal[e];}
                } else if (lValSymbols.length >= 3) {
                    if ((!this.conTextStack[curValContextLevel].values[lValSymbols[0]][lValSymbols[1]][lValSymbols[2]])
                         || typeof (this.conTextStack[curValContextLevel].values[lValSymbols[0]][lValSymbols[1]][lValSymbols[2]]) !== "object")
                         {this.conTextStack[curValContextLevel].values[lValSymbols[0]][lValSymbols[1]][lValSymbols[2]] = {__PickUp:toBePickup };}
                    if (lValSymbols.length === 3) {
                        for (var e in rValObjectVal) {this.conTextStack[curValContextLevel].values[lValSymbols[0]][lValSymbols[1]][lValSymbols[2]][e] = rValObjectVal[e];}
                    } else {
                        myContext.exitError("##!! error in expreession setValSymbols2AnyValG:too deep expr");
                    }
                }
            }
        }
    };
    setValSymbols2NewValC(lValSymbols: string[], rValObject: any) { // for current level function arguments,valiable-declare
        "use strict";
        var curValContextLevel: number = this.conTextStack.length -1;
        var toBePickup: boolean = false ;
        //
        if (lValSymbols.length === 0 || lValSymbols[0].length === 0) {
            myContext.exitError("##!! error in expreession setValSymbols2NewValC lValSymbols=" + lValSymbols);
        }
        if (lValSymbols[0].length >= 2 && lValSymbols[0][0] === "\"" && lValSymbols[0].slice(-1) === "\"") {lValSymbols[0] = "'" + lValSymbols[0].slice(1, -1) + "'";}
        var rValObjectVal = {__PickUp:toBePickup,__value:null,__vague:false,__type:""};
        if (!(!rValObject) &&
             (  ((typeof(rValObject) === "object") && (rValObject instanceof Array))
             ||((typeof(rValObject) !== "object") )
             ) ) {
            rValObjectVal.__value = rValObject;
        } else if(!(!rValObject) && (typeof(rValObject) === "object")) {
            rValObjectVal = rValObject;
            if(!rValObjectVal["__PickUp"]) {rValObjectVal["__PickUp"] = toBePickup;}
            if(!rValObjectVal["__value"]) {rValObjectVal["__value"] ={};}
        }else { // null/undefine
            rValObjectVal.__value = rValObject;
        }
        /*debug*/     traceLogger.trace(" ### setValSymbols2NewValC called :" + lValSymbols,rValObjectVal);
        if(lValSymbols[0] === "length"){ // for RangeError: Invalid array length
            traceLogger.debug("!!## debug at setValSymbols2NewValC: curValContextLevel = "  + curValContextLevel + ", this.conTextStack.length =" + this.conTextStack.length);
            //object dump traceLogger.trace(this.conTextStack[curValContextLevel].values);
            //object dump traceLogger.debug(this.conTextStack[curValContextLevel].values[lValSymbols[0]]);
            return;
        }
        if (lValSymbols.length >= 1) {
            if (lValSymbols[0][0] === "\"" && lValSymbols[0].slice(-1) === "\"") {lValSymbols[0] = "'" + lValSymbols[0].slice(1, -1) + "'";}
            if ((!this.conTextStack[curValContextLevel].values[lValSymbols[0]])
                 || typeof (this.conTextStack[curValContextLevel].values[lValSymbols[0]]) !== "object")
                 {this.conTextStack[curValContextLevel].values[lValSymbols[0]] = {__PickUp:toBePickup };}
            if(!(!this.conTextStack[curValContextLevel].values[lValSymbols[0]].__PickUp)) {rValObjectVal.__PickUp = true ;}
            if (lValSymbols.length === 1) {
                for (var e in rValObjectVal) {this.conTextStack[curValContextLevel].values[lValSymbols[0]][e] = rValObjectVal[e];}
                //traceLogger.trace(this.conTextStack[curValContextLevel].values[lValSymbols[0]]);
            } else if (lValSymbols.length >= 2) {
                if ((!this.conTextStack[curValContextLevel].values[lValSymbols[0]][lValSymbols[1]])
                     || typeof (this.conTextStack[curValContextLevel].values[lValSymbols[0][lValSymbols[1]]]) !== "object")
                     {this.conTextStack[curValContextLevel].values[lValSymbols[0]][lValSymbols[1]] = {__PickUp:toBePickup };}
                if (lValSymbols.length === 2) {
                    for (var e in rValObjectVal) {this.conTextStack[curValContextLevel].values[lValSymbols[0]][lValSymbols[1]][e] = rValObjectVal[e];}
                } else if (lValSymbols.length >= 3) {
                    if ((!this.conTextStack[curValContextLevel].values[lValSymbols[0]][lValSymbols[1]][lValSymbols[2]])
                         || typeof (this.conTextStack[curValContextLevel].values[lValSymbols[0]][lValSymbols[1]][lValSymbols[2]]) !== "object")
                         {this.conTextStack[curValContextLevel].values[lValSymbols[0]][lValSymbols[1]][lValSymbols[2]] = {__PickUp:toBePickup };}
                    if (lValSymbols.length === 3) {
                        for (var e in rValObjectVal) {this.conTextStack[curValContextLevel].values[lValSymbols[0]][lValSymbols[1]][lValSymbols[2]][e] = rValObjectVal[e];}
                    } else {
                        myContext.exitError("##!! error in expreession setValSymbols2NewValC:too deep expr");
                    }
                }
            }
        }
    };
    setValSymbols2AnyVal(lValSymbols: string[], rValObject: any) { // for function arguments,valiable-declare
        "use strict";
        var rootSymbol: string = lValSymbols[0];
        var i: number;
        var curValObjs: any = undefined;
        var curValContextLevel: number = this.conTextStack.length - 1;
        var toBePickup: boolean= false;
        var rValObjectVal = {__PickUp:toBePickup,__value:null,__vague:false,__type:""};
        if (!(!rValObject) &&
             (  ((typeof(rValObject) === "object") && (rValObject instanceof Array))
             ||((typeof(rValObject) !== "object") )
             ) ) {
            rValObjectVal.__value = rValObject;
        } else if(!(!rValObject) && (typeof(rValObject) === "object")) {
            rValObjectVal = rValObject;
            if(!rValObjectVal["__PickUp"]) {rValObjectVal["__PickUp"] = toBePickup;}
            if(!rValObjectVal["__value"]) {rValObjectVal["__value"] ={};}
        }else { // null/undefine
            rValObjectVal.__value = rValObject;
        }
        /*debug*/     traceLogger.trace(" ### setValSymbols2AnyVal called :" + lValSymbols,rValObject);
        //object dump traceLogger.trace(lValSymbols); traceLogger.trace(rValObjectVal);

        if (lValSymbols[0][0] === "$" && lValSymbols[0] !== "$inject" && lValSymbols[0] !== "$scope") { // $log etc
            rootSymbol = lValSymbols[0];
            curValContextLevel = 0; //sourceFile level scope
            curValObjs = this.conTextStack[curValContextLevel].values[rootSymbol];
        } else {
            rootSymbol = lValSymbols[0];
            var i: number = this.conTextStack.length - 1;
            for (; i >= 0; i--) {
                if (!(!this.conTextStack[i].values[rootSymbol])) {
                    curValContextLevel = i;
                    curValObjs = this.conTextStack[curValContextLevel].values[rootSymbol];
                    break;
                }
            }
            if ((!curValObjs)) {curValContextLevel = this.conTextStack.length - 1;}
        }
        if ((!this.conTextStack[curValContextLevel].values[rootSymbol]) || typeof (this.conTextStack[curValContextLevel].values[rootSymbol]) !== "object")
         {this.conTextStack[curValContextLevel].values[rootSymbol] = {};}
        curValObjs = this.conTextStack[curValContextLevel].values[rootSymbol];
        if (lValSymbols.length === 1) {
            if (!(!this.conTextStack[curValContextLevel].values[rootSymbol]["__type"]) && this.conTextStack[curValContextLevel].values[rootSymbol].__type !== rValObjectVal.__type) {
                for (var e in rValObjectVal) { this.conTextStack[curValContextLevel].values[rootSymbol][e] = rValObjectVal[e]; }
            } else {
                this.conTextStack[curValContextLevel].values[rootSymbol] = rValObjectVal;
            }
        } else if (lValSymbols.length >= 2) {
            for (i = 1; ; i++) {
                // debug traceLogger.debug("!!## debug setValSymbols2AnyVal trace i=" + i);
                if ((!curValObjs[lValSymbols[i]]) || typeof (curValObjs[lValSymbols[i]]) !== "object") { curValObjs[lValSymbols[i]] = {}; }
                // debug dump traceLogger.trace(curValObjs[lValSymbols[i]]);
                if (i >= (lValSymbols.length - 1)) { break; }
                curValObjs = curValObjs[lValSymbols[i]];
            }
            if (!(!curValObjs[lValSymbols[i]]["__type"]) && curValObjs[lValSymbols[i]].__type !== rValObjectVal.__type) {
                for (var e in rValObjectVal) { curValObjs[lValSymbols[i]][e] = rValObjectVal[e]; }
            } else {
                curValObjs[lValSymbols[i]] = rValObjectVal;
            }
        }
        // traceLogger.trace(" ### setValRef called " + typeof (n) + "::" + n + "=\t" + typeof (r) + "::" + r);
    };
    getValSymbols2AnyValG(lValSymbols: string[]): any { // for function arguments,valiable-declare
        "use strict";
        if (lValSymbols.length >= 1 && lValSymbols[0].length >= 2 && lValSymbols[0][0] === "\"" && lValSymbols[0].slice(-1) === "\"")
         {lValSymbols[0] = "'" + lValSymbols[0].slice(1, -1) + "'";}
        var valName: {className:string,methodName:string} = this.convertSymbol2Name(lValSymbols);
        var valNameStr = this.convertSymbol2NameStr(valName);
        // debug traceLogger.trace(" ### getValSymbols2AnyValG called :" + valNameStr);
        var curValContextLevel: number = 0;
        var objs: any = undefined;
        if (lValSymbols.length >= 1) {
            var rootSymbol: string = lValSymbols[0];
            if (rootSymbol[0] !== "'" && rootSymbol[0] !== "\"" && (!this.conTextStack[curValContextLevel].values[rootSymbol])) {
                if (!(!this.conTextStack[curValContextLevel].values["'" + rootSymbol + "'"])) {rootSymbol = "'" + rootSymbol + "'";}
                if (!(!this.conTextStack[curValContextLevel].values["\"" + rootSymbol + "\""])) {rootSymbol = "\"" + rootSymbol + "\"";}
            }
            if (lValSymbols.length === 1) {
                if (!this.conTextStack[curValContextLevel].values[rootSymbol]) {this.conTextStack[curValContextLevel].values[rootSymbol] = {};}
                objs = this.conTextStack[curValContextLevel].values[rootSymbol];
            } else if (lValSymbols.length >= 2) {
                if ((!this.conTextStack[curValContextLevel].values[rootSymbol])
                     || typeof (this.conTextStack[curValContextLevel].values[rootSymbol]) !== "object")
                     {this.conTextStack[curValContextLevel].values[rootSymbol] = {};}
                if (lValSymbols.length === 2) {
                    objs = this.conTextStack[curValContextLevel].values[rootSymbol][lValSymbols[1]];
                } else if (lValSymbols.length >= 3) {
                    if ((!this.conTextStack[curValContextLevel].values[rootSymbol][lValSymbols[1]])
                        || typeof (this.conTextStack[curValContextLevel].values[rootSymbol][lValSymbols[1]]) !== "object")
                        {this.conTextStack[curValContextLevel].values[rootSymbol][lValSymbols[1]] = {};}
                    if (lValSymbols.length === 3) {
                        objs = this.conTextStack[curValContextLevel].values[rootSymbol][lValSymbols[1]][lValSymbols[2]];
                    } else {
                        myContext.exitError("##!! error in expreession getValSymbols2AnyValG:too deep expr");
                    }
                }
            }
        }
        if ((!objs) || ((typeof(objs)) === "object" && Object.keys(objs).length === 0) || ((typeof(objs)) === "function")) {
            objs = valNameStr;
        }
        traceLogger.trace("!!## getValSymbols2AnyValG returns typeOf " + typeof (objs) + "=" +(typeof(objs) === "string" ? objs : ""));
        // debug dump traceLogger.trace(objs);
        return objs;
    };
    getVars(k: number): string {
        "use strict";
        var s = this.conTextStack.length - k;
        if (s < (-10)) {s = 0;} // 詳細debugレベル
        else if (s < 0) {s = 1;}
        var p = "";
        for (; s < (this.conTextStack.length); s++) {
            p = p + "{\"level\":" + (s) + "," + JSON.stringify(this.conTextStack[s].values) + "\t},\n";
        }
        return p;
    };
    exitError(errorMessage: String) {
        var messagePreFix: string = "At filename=" +  myContext.gFileName + ":" + myContext.getLineAndCharacter() + "\n" ; //遅延実行される非同期処理前に、メッセージを確定する
        console.trace();
        //log4js.shutdown(function() { 
            throw (new Error(messagePreFix + errorMessage));
        //});
    }
};
interface  MyTsExprEvalElement{
    __PickUp: boolean;
    __value: any|any[];
    __vague: boolean;
    __type:string;
}
declare type MyTsExprEvalType = MyTsExprEvalElement | string | any[] | any;
enum expandValLevel{
        expandValLevelNoID = 1,
        expandValLevelNoVauge = 2,
        expandValLevelFull = 3
};
class MyTsExprEval {
    exceptNames: string[];
    public getObjectVals(nodes: any, dml: string): string {
        if (!nodes) {return "";}
        var p: string = "";
        if (nodes.length > 0) {
            p = this.toSource(this.getObjectVal(nodes[0]));
            for (var i = 1; i < nodes.length; i++) {p += dml + this.toSource(this.getObjectVal(nodes[i]));}
        }
        return p;
    };

    /**  getObjectVal default 右辺式用　**/
    public getObjectVal(node: any | ts.Node): MyTsExprEvalType {
        return this.getObjectValE(node, expandValLevel.expandValLevelFull); /*debug set true*/
    }
    /** getObjectValR :曖昧な多値の中の代表値のみ返す関数 **/
    public getObjectValR(node: any | ts.Node): MyTsExprEvalType {
        return this.getObjectValE(node, expandValLevel.expandValLevelNoVauge);
    }
    /**  getObjectVal 左辺値用 by False expandVal　specification　 **/
    public getObjectValF(node: any | ts.Node): MyTsExprEvalType {
        return this.getObjectValE(node, expandValLevel.expandValLevelNoID);
    }
    /**  getObjectVal by expandVal　specification **/
    public getObjectValE(node: any | ts.Node, expandVal: expandValLevel): MyTsExprEvalType {
        var curValObj;
        var elementID;
        var elementIDStr:string;
        var e;
        /*! *****************************************************************************
          this code is modified from typescript.js code.
            Copyright (c) Microsoft Corporation. All rights reserved.
        ******************************************************************************/
        if (!node) {
            //myContext.exitError("##!! error in expreession re-build curNode is null")); });
            return <MyTsExprEvalElement>{__value:" "};
        }
 /*debug*/      traceLogger.trace("!!##\t#L" + myContext.getLineAndCharacter() + "\t getObjectValE node.kind=" + ((/**/<any>/**/ts).SyntaxKind[node.kind]) + "\texpandVal=" + expandVal);
        var p: string = "";
        switch (node.kind) {
            case ts.SyntaxKind.StringLiteral:
                return JSON.stringify(node.text);
            case ts.SyntaxKind.NumericLiteral /*FirstLiteralToken*/:
            case ts.SyntaxKind.RegularExpressionLiteral:
                return node.text;
            case ts.SyntaxKind.Identifier:
                return expandVal > expandValLevel.expandValLevelNoID ? myContext.getValSymbols([node.text]) : node.text; //<MyTsExprEvalElement>{__value:node.text, __PickUp:false,  __type:"", __vague:false};
            case ts.SyntaxKind.ObjectLiteralExpression:
                var obj = {}; //<MyTsExprEvalElement>{__value:{}, __PickUp:false,  __type:"", __vague:false}; //NodeArray<ObjectLiteralElement>;
                for (var i: number = 0; i < node.properties.length; i++) {obj[node.properties[i].name.getText()] = this.getObjectValE(node.properties[i].initializer, expandVal);}
                return obj;
            case ts.SyntaxKind.ArrayLiteralExpression:
                var objArray = <MyTsExprEvalElement>{__value:[], __PickUp:false,  __type:"", __vague:false};
                for (var i: number = 0; i < node.elements.length -1 ; i++) {objArray.__value.push(this.toSource(this.getObjectValE(node.elements[i], expandVal)));}
                if (i < node.elements.length) {objArray.__value.push(this.getObjectValE(node.elements[i], (expandVal === expandValLevel.expandValLevelFull && (node.parent.kind !== ts.SyntaxKind.CallExpression))? expandValLevel.expandValLevelFull:expandValLevel.expandValLevelNoID ));}
                return <MyTsExprEvalType>objArray;
            case ts.SyntaxKind.PropertyAccessExpression:
                if (expandVal > expandValLevel.expandValLevelNoVauge) {
                    var curNode = node;
                    var curSymbols1: string[] = [];
                    while (true) {
                        if (curNode.kind === ts.SyntaxKind.PropertyAccessExpression) {curSymbols1.unshift(curNode.name.text);}
                        else if (curNode.kind === ts.SyntaxKind.ElementAccessExpression) {curSymbols1.unshift("[" + this.toSource(this.getObjectVal(curNode.argumentExpression)) + "]");}
                        else {break;}
                        curNode = curNode.expression;
                    }
                    if (curNode.kind === ts.SyntaxKind.Identifier) {
                        curSymbols1.unshift(curNode.text);
                        return myContext.getValSymbols(curSymbols1);
                    } else if (curNode.kind === ts.SyntaxKind.ThisKeyword) {
                        curSymbols1.unshift("this");
                        return myContext.getValSymbols(curSymbols1);
                    } else {;} //下の評価式にフォールダウン. 
                }
                //以下の処理は、曖昧な多値の簡約抽出ができるが、pickUpedNameの抽出対象外になる
                var retValObj: MyTsExprEvalType = <MyTsExprEvalType>{ __value:"", __PickUp: false, __type: "", __vague: false };
                if (node.expression.kind === ts.SyntaxKind.ThisKeyword) {
                    curValObj = myContext.getValSymbols(["this"]); //ThisKeyword単独参照なら"this"だが、expandValLevelによらずPropertyAccessExpressionではオブジェクトを返す
                    elementID = this.getObjectValE(node.name, expandValLevel.expandValLevelNoID);
                    if (typeof (curValObj) === "object") {
                        if((["length","concat"].indexOf(elementID) >=0) || (typeof("string"[elementID]) === "function") || (typeof(["array"][elementID]) === "function")){
                            retValObj.__value = "this"  + "." + this.toSource(elementID);
                        } else if (!(!curValObj[elementID])) {
                            retValObj = curValObj[elementID];
                            retValObj.__PickUp = !(!retValObj.__PickUp);
                            retValObj.__vague = !(!retValObj.__vague);
                            if ((!retValObj.__type)) {retValObj.__type = "";}
                            if (expandVal > expandValLevel.expandValLevelNoID) {
                                if (((retValObj instanceof Array) && !(!curValObj.__vague))) {
                                    retValObj = <MyTsExprEvalType>{ __value: this.toSourceV(retValObj), __PickUp: true, __type: "", __vague: false };
                                } else if (((typeof (retValObj.__value) === "string") && (retValObj.__value[0] === "{" || retValObj.__value.slice(-1) === "}" || retValObj.__value.slice(-3) === "|} "))) {
                                    retValObj = <MyTsExprEvalType>{ __value: "this" + "." + this.toSource(elementID), __PickUp: true, __type: "", __vague: false };
                                } else if (typeof (curValObj.__value) !== "object") { //retValObjに非ず
                                    retValObj = <MyTsExprEvalType>{ __value: retValObj, __PickUp: true, __type: "", __vague: false };
                                } else {;} //retValObjの"object"をスルー 
                            } else {
                                if ((typeof (retValObj.__value) === "string") && (retValObj.__value.indexOf(" => ") < 0)) {
                                    retValObj = <MyTsExprEvalType>{ __value: retValObj.__value, __PickUp: true, __type: "", __vague: false }; //this直下のオブジェクト参照('Rest')までは式展開
                                } else {
                                    retValObj = <MyTsExprEvalType>{ __value: "this" + "." + this.toSource(elementID), __PickUp: true, __type: "", __vague: false };
                                }
                            }
                        } else if (!(!curValObj.__value) && !(!curValObj.__value[elementID])) {
                            retValObj.__value = curValObj.__value[elementID];
                            if (expandVal > expandValLevel.expandValLevelNoID) {
                                if (((retValObj instanceof Array) && !(!curValObj.__vague))) {
                                    retValObj = <MyTsExprEvalType>{ __value: this.toSourceV(retValObj), __PickUp: true, __type: "", __vague: false };
                                } else if (((typeof (retValObj.__value) === "string") && (retValObj.__value[0] === "{" || retValObj.__value.slice(-1) === "}" || retValObj.__value.slice(-3) === "|} "))) {
                                    retValObj = <MyTsExprEvalType>{ __value: "this" + "." + this.toSource(elementID), __PickUp: true, __type: "", __vague: false };
                                } else if (typeof (curValObj.__value) !== "object") { //retValObjに非ず
                                    retValObj = <MyTsExprEvalType>{ __value: retValObj, __PickUp: true, __type: "", __vague: false };
                                } else {;} //retValObjの"object"をスルー 
                            } else {
                                if ((typeof (retValObj.__value) === "string") && (retValObj.__value.indexOf(" => ") < 0)) {
                                    retValObj = <MyTsExprEvalType>{ __value: retValObj.__value, __PickUp: true, __type: "", __vague: false }; //this直下のオブジェクト参照('Rest')までは式展開
                                } else {
                                    retValObj = <MyTsExprEvalType>{ __value: "this" + "." + this.toSource(elementID), __PickUp: true, __type: "", __vague: false };
                                }
                            }
                        } else {
                            retValObj = <MyTsExprEvalType>{ __value: "this" + "." + this.toSource(elementID), __PickUp: true, __type: "", __vague: false };
                        }
                    } else if (typeof (curValObj.__value) === "string") {
                        retValObj.__value = this.toSource(curValObj) + "." + this.toSource(elementID);
                    } else {
                        retValObj.__value = "this" + "." + this.toSource(elementID);
                    }
                } else {
                    curValObj = this.getObjectValE(node.expression, expandVal);
                    elementID = this.getObjectValE(node.name, expandValLevel.expandValLevelNoID);
                    if (typeof (curValObj) === "object") {
                        if((["length","concat"].indexOf(elementID) >=0) || (typeof("string"[elementID]) === "function") || (typeof(["array"][elementID]) === "function")){ //[native code]function を除外する
                            //(["anchor","big","blink","bold","charAt","charCodeAt","codePointAt","concat","copyWithin","endsWith","fill","fixed","fontcolor","fontsize","forEach","includes","includes","indexOf","italics","join","lastIndexOf","length","link","localeCompare","map","match","normalize","pop","push","quote","repeat","replace","reverse","search","shift","slice","small","some","sort","splice","split","startsWith","strike","sub","substr","substring","sup","toLocaleLowerCase","toLocaleString","toLocaleUpperCase","toLowerCase","toSource","toSource","toString","toUpperCase","trim","trimLeft","trimRight","unshift","valueOf"].indexOf(elementID) >= 0)
                            retValObj.__value = this.toSource(curValObj) + "." + this.toSource(elementID);
                            if (retValObj.__value[0] === "{") {
                                retValObj.__value = this.toSource(this.getObjectValE(node.expression, expandValLevel.expandValLevelNoID)) + "." + this.toSource(elementID);
                            }
                        } else if (!(!curValObj[elementID])) {
                            retValObj = curValObj[elementID];
                        } else if (!(!curValObj.__value) && !(!curValObj.__value[elementID])) {
                            retValObj = curValObj.__value[elementID];
                            retValObj.__PickUp = !(!retValObj.__PickUp);
                            retValObj.__vague = !(!retValObj.__vague);
                            if ((!retValObj.__type)) {retValObj.__type = "";}
                        } else if ((curValObj.__value instanceof Array) && !(!curValObj.__vague)) {
                            retValObj.__value = this.toSourceV(curValObj) + "." + this.toSource(elementID);
                        } else if (typeof (curValObj.__value) === "string") {
                            if (curValObj.__value[0] === "{" || curValObj.__value.slice(-1) === "}" || curValObj.__value.slice(-3) === "|} ") {
                                curValObj = this.getObjectValE(node.expression, expandValLevel.expandValLevelNoID);
                                retValObj.__value = this.toSource(curValObj) + "." + this.toSource(elementID);
                            //} else if(curValObj.__value.indexOf("[native code]") >=0){
                            //  retValObj.__value = this.toSource(this.getObjectValE(node.expression, expandValLevel.expandValLevelNoID)) + "." + this.toSource(elementID);
                            } else {
                                retValObj.__value = curValObj.__value + "." + this.toSource(elementID);
                            }
                        } else { retValObj.__value = this.toSource(this.getObjectValE(node.expression, expandValLevel.expandValLevelNoID)) + "." + this.toSource(elementID); }
                    } else if (typeof (curValObj) === "string") {
                        if (curValObj[0] === "{" || curValObj.slice(-1) === "}" || curValObj.slice(-3) === "|} ") {
                            curValObj = this.getObjectValE(node.expression, expandValLevel.expandValLevelNoID);
                            retValObj.__value = this.toSource(curValObj) + "." + this.toSource(elementID);
                        } else {
                            retValObj.__value = curValObj + "." + this.toSource(elementID);
                        }
                    } else {
                        retValObj.__value = this.toSource(curValObj) + "." + this.toSource(elementID);
                    }
                }
                traceLogger.trace("!!## debug trace at ts.SyntaxKind.PropertyAccessExpression: returns ",retValObj);
                return retValObj;
                //break;
            case ts.SyntaxKind.ElementAccessExpression: //topレベルの引数は 文字列連結
                curValObj = this.getObjectValE(node.expression, expandVal);
                elementID = this.getObjectVal(node.argumentExpression);
                elementIDStr = this.toSource(elementID);
                if ((curValObj instanceof Array)) {
                    if ((typeof (elementID) === "number") && (elementID < curValObj.length) && !(!curValObj[elementID])) {return curValObj[elementID];}
                    else if (curValObj.length === 1) {return curValObj[0];}
                    else {return {__value:this.toSource(this.getObjectValF(node.expression)) + "[" + elementIDStr + "]", __PickUp: false,  __vague: false,__type:""};}
                } else if (typeof (curValObj) === "object") {
                    if (!(!curValObj[elementIDStr])) {return curValObj[elementIDStr];}
                    else if (!(!curValObj["[" + elementIDStr + "]"])) {return curValObj["[" + elementIDStr + "]"];}
                    else if (!(!curValObj["[\"" + elementIDStr + "\"]"])) {return curValObj["[\"" + elementIDStr + "\"]"];}
                    else if (!(!curValObj.__value) && (typeof (curValObj.__value) !== "object")) {return <MyTsExprEvalType>{__value: curValObj.__value + "[" + elementIDStr + "]",  __PickUp: !(!curValObj.__PickUp),  __vague: !(!curValObj.__vague),__type:curValObj.__type};}
                    else if (!(!curValObj.__value) && !(!curValObj.__value["__value"]) && typeof(curValObj.__value.__value) !== "object") { return curValObj.__value.__value; } //1要素しかないnon-object
                    else if (!(!curValObj.__value) && !(!curValObj.__value["__value"]) && Object.keys(curValObj.__value.__value).length === 1) { for (e in curValObj.__value.__value) {return curValObj.__value.__value[e];} } //1要素しかないオブジェクトは最初の要素を返す
                    else if (!(!curValObj.__value) && Object.keys(curValObj.__value).length === 1) { for (e in curValObj.__value) {return curValObj.__value[e];} } //1要素しかないオブジェクトは最初の要素を返す
                    else if (!(!curValObj.__value) && (!curValObj.__vague)) {
                        if (!(!curValObj.__value[elementIDStr])) {return curValObj.__value[elementIDStr];}
                        else if (!(!curValObj.__value["[" + elementIDStr + "]"])){return curValObj.__value["[" + elementIDStr + "]"];}
                        else if (!(!curValObj.__value["[\"" + elementIDStr + "\"]"])) {return curValObj.__value["[\"" + elementIDStr + "\"]"];}
                        //error　フォールダウンする
                    } else if (!(!curValObj.__value) && !(!curValObj.__vague)) {
                        return <MyTsExprEvalType>{__value: this.toSource(this.getObjectValF(node.expression)) + "[" + elementIDStr + "]", __PickUp: !(!curValObj.__PickUp),  __vague: !(!curValObj.__vague),__type:curValObj.__type || ""};
                    } else { //error　フォールダウンする
                    }
                } else {
                    return <MyTsExprEvalType>{__value: this.toSource(this.getObjectValF(node.expression)) + "[" + elementIDStr + "]", __PickUp: !(!curValObj.__PickUp),  __vague: !(!curValObj.__vague),__type:curValObj.__type || ""};
                }
                //曖昧な多値を組立
                if (expandVal >= expandValLevel.expandValLevelFull) {
                    var curValElement = [];
                    if ((curValObj.__value instanceof Array)) {for (i = 0; i < curValObj.__value.length; i++) {curValElement.push(curValObj.__value[i]); /*0個の要素は除外*/ }}
                    else if (!(!curValObj.__value)) {
                        if (!(!curValObj.__value["__value"])) {for (e in curValObj.__value.__value) {if (e[0] === "[") {curValElement.push(curValObj.__value.__value[e]);}}}
                        for (e in curValObj.__value) {if (e[0] === "[") {curValElement.push(curValObj.__value[e]);}}
                    }
                    for (var e in curValObj) {
                        if (e[0] === "[") {
                            curValElement.push((curValObj[e]));
                        }
                    }
                    if (curValElement.length > 1) {return { __PickUp: false, __value: this.toSource(this.getObjectValE(node.expression, expandValLevel.expandValLevelNoID)) + /**x1**/ "[" + elementIDStr + "]", __vague: false, __type: "" };}
                    else {return { __PickUp: false, __value: curValElement[0], __vague: false, __type: "" };}
                    //
                    traceLogger.trace("!!## error in at ts.SyntaxKind.ElementAccessExpression: elementID=" + elementIDStr + ",typeof(curValObj)=" + typeof (curValObj));
                    // debug dump traceLogger.trace(curValObj);
                    return { __PickUp: false, __value: this.toSource(this.getObjectValE(node.expression, expandValLevel.expandValLevelNoID)) + "[" + elementIDStr + "]", __vague: false, __type: "" };
                } else if (expandVal >= expandValLevel.expandValLevelNoVauge) { //曖昧な多値の中の先頭値を返す
                    var curValElement = [];
                    if ((curValObj.__value instanceof Array) && curValObj.__value.length > 0) {curValElement.push(curValObj.__value[0]); /*0個の要素は除外 */ }
                    for (var e in curValObj) {
                        if (e[0] === "[") {
                            curValElement.push((curValObj[e]));
                            break;
                        }
                    }
                    return { __PickUp: !(!curValObj.__PickUp), __value: curValElement[0], __vague: (curValElement.length > 1 || curValObj.__vague), __type: curValObj.__type || "" };
                } else {
                    return { __PickUp: !(!curValObj.__PickUp), __value: this.toSource(this.getObjectValE(node.expression, expandValLevel.expandValLevelNoID)) + "[" + elementIDStr + "]" , __vague: false, __type: curValObj.__type || ""};
                }

            case ts.SyntaxKind.CallExpression:
                var p:string = this.toSource(this.getObjectValE(node.expression, expandVal));
                p += ((!(!node.typeArguments)) ? this.getObjectVals((<ts.CallExpression>node).typeArguments, ", ") + " " : "");
                p += "(";
                if ((<ts.CallExpression>node).arguments.length > 0) {
                    var objStr: string = this.toSource(this.getObjectValE((<ts.CallExpression>node).arguments[0], expandVal));
                    if (objStr.length > 3900) {objStr = "<" + curTypeChecker.typeToString(curTypeChecker.getTypeAtLocation(node)) + ">" + this.toSource(this.getObjectValE((<ts.CallExpression>node).arguments[0], expandValLevel.expandValLevelNoID));}
                    p += objStr;
                    for (var i: number = 1; i < (<ts.CallExpression>node).arguments.length; i++) {
                        objStr = this.toSource(this.getObjectValE((<ts.CallExpression>node).arguments[i], expandVal));
                        if (objStr.length > 3900) {objStr = "<" + curTypeChecker.typeToString(curTypeChecker.getTypeAtLocation((<ts.CallExpression>node).arguments[i])) + ">" + this.toSource(this.getObjectValE((<ts.CallExpression>node).arguments[i], expandValLevel.expandValLevelNoID));}
                        p += ", " + objStr;
                    }
                }
                p += ")";
                return <MyTsExprEvalType>{__PickUp:false, __value: p, __type:"", __vague:false};
            case ts.SyntaxKind.NewExpression:
                p = "(new " + this.toSource(this.getObjectValE(node.expression, expandValLevel.expandValLevelNoID));
                                p += ((!(!node.typeArguments)) ? this.getObjectVals((<ts.NewExpression>node).typeArguments, ", ") + " " : "");
                p += "(";
                if ((<ts.NewExpression>node).arguments.length > 0) {
                    var objStr: string = this.toSource(this.getObjectValE((<ts.NewExpression>node).arguments[0], expandValLevel.expandValLevelNoVauge));
                    if (objStr.length > 3900) {
                        objStr = "<" + curTypeChecker.typeToString(curTypeChecker.getTypeAtLocation((<ts.NewExpression>node).arguments[0])) + ">"
                         + this.toSource(this.getObjectValE((<ts.NewExpression>node).arguments[0], expandVal));
                    }
                    p += objStr;
                    for (var i: number = 1; i < (<ts.NewExpression>node).arguments.length; i++) {
                        objStr = this.toSource(this.getObjectValE((<ts.NewExpression>node).arguments[i], expandVal));
                        if (objStr.length > 3900) {
                            objStr = "<" + curTypeChecker.typeToString(curTypeChecker.getTypeAtLocation((<ts.NewExpression>node).arguments[i])) + ">"
                             + this.toSource(this.getObjectValE((<ts.NewExpression>node).arguments[i], expandValLevel.expandValLevelNoID));
                        }
                        p += ", " + objStr;
                    }
                }
                p += "))";
                return <MyTsExprEvalType>{__PickUp:false, __value: p, __type:"", __vague:false};
            case ts.SyntaxKind.BinaryExpression:
                var operatorTokenStr: string = node.operatorToken.getText();
                var exprRightVal: MyTsExprEvalType = this.getObjectValE(node.right, expandVal);
                if ((ts.SyntaxKind.FirstAssignment <= (<ts.BinaryExpression>node).operatorToken.kind)  && ((<ts.BinaryExpression>node).operatorToken.kind <= ts.SyntaxKind.LastAssignment)){
                    if(operatorTokenStr === "=") {return exprRightVal;}
                    var exprLeftVal: MyTsExprEvalType = this.getObjectValE((<ts.BinaryExpression>node).left, expandValLevel.expandValLevelNoID);
                } else {
                    var exprLeftVal: MyTsExprEvalType = this.getObjectValE((<ts.BinaryExpression>node).left, expandVal);
                }
                var exprRightStr:string = this.toSource(exprRightVal);
                var exprLeftStr: string = this.toSource(exprLeftVal);
                if (operatorTokenStr === "+" &&
                    (exprLeftStr.slice(-1) === "'" || exprLeftStr.slice(-1) === "\"") &&
                    (exprRightStr[0] === "'" || exprRightStr[0] === "\""))
                    {return <MyTsExprEvalType>{__value: exprLeftStr.slice(0, -1) + exprRightStr.slice(1), __PickUp:false,  __type:"string", __vague:false};}
                else {return <MyTsExprEvalType>{__value: exprLeftStr + " " + operatorTokenStr + " " + exprRightStr, __PickUp:false,  __type:exprRightVal.__type, __vague:false};}
                break;
            case ts.SyntaxKind.PrefixUnaryExpression:
                return <MyTsExprEvalType>{__value:ts.tokenToString(node.operator) + " " + this.toSource(this.getObjectValE(node.operand, expandVal)), __PickUp:false,  __type:"", __vague:false};
            case ts.SyntaxKind.PostfixUnaryExpression:
                return <MyTsExprEvalType>{__value:this.toSource(this.getObjectValE(node.operand, expandVal)) + ts.tokenToString(node.operator), __PickUp:false,  __type:"", __vague:false};
            case ts.SyntaxKind.ConditionalExpression:
                return <MyTsExprEvalType>{__value:"(" + this.toSource(this.getObjectVal(node.condition)) +
                    " ? " + //ts.tokenToString(node.questionToken) + " " +
                    this.toSource(this.getObjectVal(node.whenTrue)) +
                    " : " + //ts.tokenToString(node.colonToken) + " " +
                    this.toSource(this.getObjectVal(node.whenFalse)) + ")",
                    __PickUp:false,  __type:"", __vague:false};
            case ts.SyntaxKind.ParenthesizedExpression:
                obj = <MyTsExprEvalElement>this.getObjectValE(node.expression, expandVal);
                if(typeof(obj) === "object" && !(!obj["__value"]) && typeof(obj["__value"]) === "object") {return obj;}
                else {return <MyTsExprEvalType>{__value:"(" + this.toSource(obj) + ")",__PickUp:false,  __type:"", __vague:false};}
                break;
            /*
            case ts.SyntaxKind. MethodDeclaration:
            case ts.SyntaxKind. MethodSignature:
            case ts.SyntaxKind. Constructor:
            case ts.SyntaxKind. GetAccessor:
            case ts.SyntaxKind. SetAccessor:
            case ts.SyntaxKind. FunctionDeclaration:
            case ts.SyntaxKind.FunctionType:
            */
            case ts.SyntaxKind.FunctionExpression:
            case ts.SyntaxKind.ArrowFunction:
                //ArrowFunctionは、複文を含んで、長い文字列となるため、短縮文字列としてtype情報を返す。ArrowFunctionのbodyは、別レコードに出力するので、情報は補われる。
                var curTypeStr:string =curTypeChecker.typeToString(curTypeChecker.getTypeAtLocation(node));
                return <MyTsExprEvalType>{__value:"/**" + curTypeStr + "**/",__PickUp:false,  __type:curTypeStr, __vague:false};
            /*  return this.getObjectVals((<ts.ArrowFunction>node).decorators," ") + " " +
                    this.getObjectVals((<ts.ArrowFunction>node).modifiers," ") + " " +
                    this.getObjectVal( (<ts.ArrowFunction>node).asteriskToken) + " " +
                    this.getObjectVal( (<ts.ArrowFunction>node).name) + " " +
                    this.getObjectVal( (<ts.ArrowFunction>node).questionToken) + " " +
                    this.getObjectVals((<ts.ArrowFunction>node).typeParameters," ") + " " +
                    this.getObjectVals((<ts.ArrowFunction>node).parameters,", ") + " " +
                    this.getObjectVal( (<ts.ArrowFunction>node).type) + " " +
                    this.getObjectVal( (<ts.ArrowFunction>node).equalsGreaterThanToken) + " " +
                    this.getObjectVal( (<ts.ArrowFunction>node).body);
            */
            case ts.SyntaxKind.TypeAssertionExpression:
                curTypeStr = this.toSource(this.getObjectValE(node.type, expandValLevel.expandValLevelNoID));
                traceLogger.trace("!!## TypeAssertionExpression = " + curTypeStr);
                var objs = this.getObjectValE(node.expression, expandVal);
                var retVal: MyTsExprEvalType;
                if ((typeof (objs) !== "object") || (objs instanceof Array)) {
                    retVal = <MyTsExprEvalType>{ __PickUp: false, __type: curTypeStr, __value: objs, __vague: false };
                } else {
                    if (!(!objs)) {
                        objs["__type"] = curTypeStr;
                        retVal = objs;
                    } else { // null or undefine
                        retVal = <MyTsExprEvalType>{ __value: objs, __PickUp: false, __type: curTypeStr, __vague: false };
                    }
                    var retValMemberNames: string[] = Object.keys(retVal);
                    var hasOwnMember: boolean = false;
                    for (var i: number = 0; i < retValMemberNames.length; i++) {
                        if (["__value", "__PickUp", "__type", "__vague"].indexOf(retValMemberNames[i]) < 0) { hasOwnMember = true; }
                    }
                    if ((hasOwnMember) || (!retVal.__value) || ((typeof (retVal.__value) === "string") && (retVal.__value.slice(-2) === "{}"))) {
                        var curNodeType: ts.Type = curTypeChecker.getTypeAtLocation(node);
                        if (!(!curNodeType)) {
                            var curMemberSymbols: ts.Symbol[] = curNodeType.getProperties();
                            if (!(!curMemberSymbols)) {
                                for (var i: number = 0; i < curMemberSymbols.length; i++) {
                                    if (((curMemberSymbols[i].flags & (ts.SymbolFlags.PropertyOrAccessor | ts.SymbolFlags.Variable)) !== 0) && ((curMemberSymbols[i].flags & (ts.SymbolFlags.Optional)) === 0)) {
                                        var curMemberName: string = curTypeChecker.symbolToString(curMemberSymbols[i]);
                                        if ((retValMemberNames.indexOf(curMemberName) < 0)) {
                                            var isNotOptionalProperty: boolean = true;
                                            for (var j: number = 0; j < this.exceptNames.length; j++) {
                                                if (curMemberName.lastIndexOf(this.exceptNames[j], 0) === 0) { isNotOptionalProperty = false; }
                                            }
                                            if (isNotOptionalProperty) {
                                                retVal[curMemberName] = "/** !! undefined **/";
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return retVal;
            case ts.SyntaxKind.TypeReference:
                return <MyTsExprEvalType>{__value: this.toSource(this.getObjectValE(<ts.TypeReference>node.typeName, expandValLevel.expandValLevelNoID)) +
                    (!(!((<ts.TypeReference>node).typeArguments)) ? (" /*typeArguments " +(this.getObjectVals((<ts.TypeReference>node).typeArguments, ", ")) + " */") : "")
                    , __PickUp: false,__type:curTypeStr, __vague: false };
            case ts.SyntaxKind.TypeLiteral:
                return <MyTsExprEvalType>{__value:this.getObjectVals((<ts.TypeLiteralNode>node).members, " "), __PickUp: false,__type:"", __vague: false };
            case ts.SyntaxKind.TypeOfExpression:
                return <MyTsExprEvalType>{__value:"typeOf(" + this.toSource(this.getObjectValE(node.expression, expandVal)) + ")", __PickUp: false,__type:"", __vague: false };
            case ts.SyntaxKind.ThisKeyword: return <MyTsExprEvalType>{__value:"this", __PickUp: false,__type:"", __vague: false };
            case ts.SyntaxKind.NullKeyword: return <MyTsExprEvalType>{__value:"null", __PickUp: false,__type:"object", __vague: false };
            case ts.SyntaxKind.FalseKeyword: return <MyTsExprEvalType>{__value:"false", __PickUp: false,__type:"boolean", __vague: false };
            case ts.SyntaxKind.TrueKeyword: return <MyTsExprEvalType>{__value:"true", __PickUp: false,__type:"boolean", __vague: false };
            case ts.SyntaxKind.StringKeyword: return <MyTsExprEvalType>{__value:"string", __PickUp: false,__type:"", __vague: false };
            case ts.SyntaxKind.AnyKeyword: return <MyTsExprEvalType>{__value:"any", __PickUp: false,__type:"object", __vague: false };
            case ts.SyntaxKind.VoidKeyword: return <MyTsExprEvalType>{__value:"void", __PickUp: false,__type:"object", __vague: false };
            case ts.SyntaxKind.OmittedExpression:
                return <MyTsExprEvalType>{__value:" undefine ", __PickUp: false,__type:" undefine ", __vague: false };
            case ts.SyntaxKind.NumberKeyword: return <MyTsExprEvalType>{__value:"number", __PickUp: false,__type:" undefine ", __vague: false };
            case ts.SyntaxKind.BooleanKeyword: return <MyTsExprEvalType>{__value:"boolean", __PickUp: false,__type:"", __vague: false };
            case ts.SyntaxKind.Parameter:
            case ts.SyntaxKind.PropertyDeclaration:
            case ts.SyntaxKind.PropertySignature:
            case ts.SyntaxKind.PropertyAssignment:
            case ts.SyntaxKind.ShorthandPropertyAssignment:
            case ts.SyntaxKind.VariableDeclaration:
            case ts.SyntaxKind.BindingElement:
                return <MyTsExprEvalType>{__value:"" +
                    (this.getObjectVals(node.decorators, " ")) + " " +
                    (this.getObjectVals(node.modifiers, " ")) + " " +
                    this.toSource(this.getObjectValE(node.propertyName, expandValLevel.expandValLevelNoID)) +
                    ts.tokenToString(node.dotDotDotToken) +
                    this.toSource(this.getObjectValE(node.name, expandValLevel.expandValLevelNoID)) +
                    /*this.getObjectValE(node.questionToken,expandVal) */ "?: " +
                    this.toSource(this.getObjectValE(node.type, expandValLevel.expandValLevelNoID)) + " " +
                    this.toSource(this.getObjectValE(node.initializer, expandValLevel.expandValLevelNoID))
                    , __PickUp:false,  __type:"", __vague:false};
            case ts.SyntaxKind.IndexSignature:
                return <MyTsExprEvalType>{__value:"[" +
                    this.getObjectVals(node.decorators, " ") + " " +
                    this.getObjectVals(node.modifiers, " ") + " " +
                    this.getObjectVals(node.typeParameters, " ") + " " +
                    this.getObjectVals(node.parameters, " ") + "]: " +
                    this.toSource(this.getObjectValE(node.type, expandVal)) + ""
                    , __PickUp:false,  __type:"", __vague:false};
            case ts.SyntaxKind.QualifiedName:
                return <MyTsExprEvalType>{__value:this.toSource(this.getObjectValE(node.left, expandVal)) + "." +
                    this.toSource(this.getObjectValE(node.right, expandValLevel.expandValLevelNoID)), __PickUp:false,  __type:"", __vague:false};
            case ts.SyntaxKind.ArrayType:
                return <MyTsExprEvalType>{__value:this.getObjectValE((<ts.ArrayTypeNode>node).elementType, expandVal), __PickUp:false,  __type:"", __vague:false};
            /*
            case ts.SyntaxKind.TypeParameter:
                return this.toSource(this.getObjectValE(node.name, false)) + " " +
                    this.toSource(this.getObjectValE(node.constraint, false)) + " " +
                    this.toSource(this.getObjectValE(node.expression, expandVal));
            case ts.SyntaxKind. ConstructorType:
            case ts.SyntaxKind. CallSignature:
            case ts.SyntaxKind. ConstructSignature:

            case ts.SyntaxKind.TypeQuery:
                return "<" + this.toSource(this.getObjectValE(node.exprName, false)) + ">";
            case ts.SyntaxKind.TupleType:
                return this.getObjectVals((<ts.TupleType>node).elementTypes, ",");
            case ts.SyntaxKind.UnionType:
                return this.getObjectVals((<ts.UnionType>node).types, ",");
            case ts.SyntaxKind.ParenthesizedType:
                return "(" + this.toSource(this.getObjectValE(node.type, false)) + ")";
            case ts.SyntaxKind. ObjectBindingPattern:
            case ts.SyntaxKind. ArrayBindingPattern:
                return this.getObjectVals(node.elements, ", ");
            case ts.SyntaxKind. TaggedTemplateExpression:
                return this.toSource(this.getObjectVal( node.tag)) + "<" +
                    this.toSource(this.getObjectVal( node.template)) + ">";
            case ts.SyntaxKind.DeleteExpression:
                return this.getObjectValE(node.expression, expandVal);
            case ts.SyntaxKind.VoidExpression:
                return this.getObjectValE(node.expression, expandVal);
            case ts.SyntaxKind.YieldExpression:
                return this.getObjectValE(node.asteriskToken, expandVal) + " " +
                    this.getObjectValE(node.expression, expandVal);
            case ts.SyntaxKind.SpreadElementExpression:
                return this.getObjectValE(node.expression, expandVal);
            case ts.SyntaxKind.Block:
                return "{ }";
            case ts.SyntaxKind. ModuleBlock:
                return this.getObjectVals(node.statements);
            case ts.SyntaxKind. SourceFile:
                return this.getObjectVals(node.statements) + " " +
                    this.getObjectVal( node.endOfFileToken);
            case ts.SyntaxKind. VariableStatement:
                return this.getObjectVals(node.decorators) + " " +
                    this.getObjectVals(node.modifiers) + " " +
                    this.getObjectVal( node.declarationList);
            case ts.SyntaxKind. VariableDeclarationList:
                return this.getObjectVals(node.declarations);
            case ts.SyntaxKind. ExpressionStatement:
                return this.getObjectVal( node.expression);
            case ts.SyntaxKind. IfStatement:
                return this.getObjectVal( node.expression) + " " +
                    this.getObjectVal( node.thenStatement) + " " +
                    this.getObjectVal( node.elseStatement);
            case ts.SyntaxKind. DoStatement:
                return this.getObjectVal( node.statement) + " " +
                    this.getObjectVal( node.expression);
            case ts.SyntaxKind. WhileStatement:
                return this.getObjectVal( node.expression) + " " +
                    this.getObjectVal( node.statement);
            case ts.SyntaxKind. ForStatement:
                return this.getObjectVal( node.initializer) + " " +
                    this.getObjectVal( node.condition) + " " +
                    this.getObjectVal( node.iterator) + " " +
                    this.getObjectVal( node.statement);
            case ts.SyntaxKind. ForInStatement:
                return this.getObjectVal( node.initializer) + " " +
                    this.getObjectVal( node.expression) + " " +
                    this.getObjectVal( node.statement);
            case ts.SyntaxKind. ForOfStatement:
                return this.getObjectVal( node.initializer) + " " +
                    this.getObjectVal( node.expression) + " " +
                    this.getObjectVal( node.statement);
            case ts.SyntaxKind. ContinueStatement:
            case ts.SyntaxKind. BreakStatement:
                return this.getObjectVal( node.label);
            case ts.SyntaxKind. ReturnStatement:
                return this.getObjectVal( node.expression);
            case ts.SyntaxKind. WithStatement:
                return this.getObjectVal( node.expression) + " " +
                    this.getObjectVal( node.statement);
            case ts.SyntaxKind. SwitchStatement:
                return this.getObjectVal( node.expression) + " " +
                    this.getObjectVal( node.caseBlock);
            case ts.SyntaxKind. CaseBlock:
                return this.getObjectVals(node.clauses);
            case ts.SyntaxKind. CaseClause:
                return this.getObjectVal( node.expression) + " " +
                    this.getObjectVals(node.statements);
            case ts.SyntaxKind. DefaultClause:
                return this.getObjectVals(node.statements);
            case ts.SyntaxKind. LabeledStatement:
                return this.getObjectVal( node.label) + " " +
                    this.getObjectVal( node.statement);
            case ts.SyntaxKind. ThrowStatement:
                return this.getObjectVal( node.expression);
            case ts.SyntaxKind. TryStatement:
                return this.getObjectVal( node.tryBlock) + " " +
                    this.getObjectVal( node.catchClause) + " " +
                    this.getObjectVal( node.finallyBlock);
            case ts.SyntaxKind. CatchClause:
                return this.getObjectVal( node.variableDeclaration) + " " +
                    this.getObjectVal( node.block);
            case ts.SyntaxKind. Decorator:
                return this.getObjectVal( node.expression);
            case ts.SyntaxKind. ClassDeclaration:
            case ts.SyntaxKind. ClassExpression:
                return this.getObjectVals(node.decorators) + " " +
                    this.getObjectVals(node.modifiers) + " " +
                    this.getObjectVal( node.name) + " " +
                    this.getObjectVals(node.typeParameters) + " " +
                    this.getObjectVals(node.heritageClauses) + " " +
                    this.getObjectVals(node.members);
            case ts.SyntaxKind. InterfaceDeclaration:
                return this.getObjectVals(node.decorators) + " " +
                    this.getObjectVals(node.modifiers) + " " +
                    this.getObjectVal( node.name) + " " +
                    this.getObjectVals(node.typeParameters) + " " +
                    this.getObjectVals(node.heritageClauses) + " " +
                    this.getObjectVals(node.members);
            case ts.SyntaxKind. TypeAliasDeclaration:
                return this.getObjectVals(node.decorators) + " " +
                    this.getObjectVals(node.modifiers) + " " +
                    this.getObjectVal( node.name) + " " +
                    this.getObjectVal( node.type);
            case ts.SyntaxKind. EnumDeclaration:
                return this.getObjectVals(node.decorators) + " " +
                    this.getObjectVals(node.modifiers) + " " +
                    this.getObjectVal( node.name) + " " +
                    this.getObjectVals(node.members);
            case ts.SyntaxKind. EnumMember:
                return this.getObjectVal( node.name) + " " +
                    this.getObjectVal( node.initializer);
            case ts.SyntaxKind. ModuleDeclaration:
                return this.getObjectVals(node.decorators) + " " +
                    this.getObjectVals(node.modifiers) + " " +
                    this.getObjectVal( node.name) + " " +
                    this.getObjectVal( node.body);
            case ts.SyntaxKind. ImportEqualsDeclaration:
                return this.getObjectVals(node.decorators) + " " +
                    this.getObjectVals(node.modifiers) + " " +
                    this.getObjectVal( node.name) + " " +
                    this.getObjectVal( node.moduleReference);
            case ts.SyntaxKind. ImportDeclaration:
                return this.getObjectVals(node.decorators) + " " +
                    this.getObjectVals(node.modifiers) + " " +
                    this.getObjectVal( node.importClause) + " " +
                    this.getObjectVal( node.moduleSpecifier);
            case ts.SyntaxKind. ImportClause:
                return this.getObjectVal( node.name) + " " +
                    this.getObjectVal( node.namedBindings);
            case ts.SyntaxKind. NamespaceImport:
                return this.getObjectVal( node.name);
            case ts.SyntaxKind. NamedImports:
            case ts.SyntaxKind. NamedExports:
                return this.getObjectVals(node.elements);
            case ts.SyntaxKind. ExportDeclaration:
                return this.getObjectVals(node.decorators) + " " +
                    this.getObjectVals(node.modifiers) + " " +
                    this.getObjectVal( node.exportClause) + " " +
                    this.getObjectVal( node.moduleSpecifier);
            case ts.SyntaxKind. ImportSpecifier:
            case ts.SyntaxKind. ExportSpecifier:
                return this.getObjectVal( node.propertyName) + " " +
                    this.getObjectVal( node.name);
            case ts.SyntaxKind. ExportAssignment:
                return this.getObjectVals(node.decorators) + " " +
                    this.getObjectVals(node.modifiers) + " " +
                    this.getObjectVal( node.expression);
            case ts.SyntaxKind. TemplateExpression:
                return this.getObjectVal( node.head) + " " + this.getObjectVals(node.templateSpans);
            case ts.SyntaxKind. TemplateSpan:
                return this.getObjectVal( node.expression) + " " + this.getObjectVal( node.literal);
            case ts.SyntaxKind. ComputedPropertyName:
                return this.getObjectVal( node.expression);
            case ts.SyntaxKind. HeritageClause:
                return this.getObjectVals(node.types);
            case ts.SyntaxKind. HeritageClauseElement:
                return this.getObjectVal( node.expression) + " " +
                    this.getObjectVals(node.typeArguments);
            case ts.SyntaxKind. ExternalModuleReference:
                return this.getObjectVal( node.expression);
            case ts.SyntaxKind. MissingDeclaration:
                return this.getObjectVals(node.decorators);
            case ts.SyntaxKind.OpenBraceToken: return "{";
            case ts.SyntaxKind.CloseBraceToken: return "}";
            case ts.SyntaxKind.OpenParenToken: return "(";
            case ts.SyntaxKind.CloseParenToken: return ")";
            case ts.SyntaxKind.OpenBracketToken: return "[";
            case ts.SyntaxKind.CloseBracketToken: return "]";
            case ts.SyntaxKind.DotToken: return ".";
            case ts.SyntaxKind.DotDotDotToken: return "...";
            case ts.SyntaxKind.SemicolonToken: return ";";
            case ts.SyntaxKind.CommaToken: return ",";
            case ts.SyntaxKind.LessThanToken: return "<";
            case ts.SyntaxKind.GreaterThanToken: return ">";
            case ts.SyntaxKind.LessThanEqualsToken: return "<=";
            case ts.SyntaxKind.GreaterThanEqualsToken: return ">=";
            case ts.SyntaxKind.EqualsEqualsToken: return "==";
            case ts.SyntaxKind.ExclamationEqualsToken: return "!=";
            case ts.SyntaxKind.EqualsEqualsEqualsToken: return "===";
            case ts.SyntaxKind.ExclamationEqualsEqualsToken: return "!==";
            case ts.SyntaxKind.EqualsGreaterThanToken: return "=>";
            case ts.SyntaxKind.PlusToken: return "+";
            case ts.SyntaxKind.MinusToken: return "-";
            case ts.SyntaxKind.AsteriskToken: return "*";
            case ts.SyntaxKind.SlashToken: return "/";
            case ts.SyntaxKind.PercentToken: return "%";
            case ts.SyntaxKind.PlusPlusToken: return "++";
            case ts.SyntaxKind.MinusMinusToken: return "--";
            case ts.SyntaxKind.LessThanLessThanToken: return "<<";
            case ts.SyntaxKind.GreaterThanGreaterThanToken: return ">>";
            case ts.SyntaxKind.GreaterThanGreaterThanGreaterThanToken: return ">>>";
            case ts.SyntaxKind.AmpersandToken: return "&";
            case ts.SyntaxKind.BarToken: return "|";
            case ts.SyntaxKind.CaretToken: return "^";
            case ts.SyntaxKind.ExclamationToken: return "!";
            case ts.SyntaxKind.TildeToken: return "~";
            case ts.SyntaxKind.AmpersandAmpersandToken: return "&&";
            case ts.SyntaxKind.BarBarToken: return "||";
            case ts.SyntaxKind.QuestionToken: return "?";
            case ts.SyntaxKind.ColonToken: return ":";
            case ts.SyntaxKind.AtToken: return "@";
            case ts.SyntaxKind.EqualsToken: return "="; //FirstAssignment
            case ts.SyntaxKind.PlusEqualsToken: return "+=";
            case ts.SyntaxKind.MinusEqualsToken: return "-=";
            case ts.SyntaxKind.AsteriskEqualsToken: return "*=";
            case ts.SyntaxKind.SlashEqualsToken: return "/=";
            case ts.SyntaxKind.PercentEqualsToken: return "%=";
            case ts.SyntaxKind.LessThanLessThanEqualsToken: return "<<=";
            case ts.SyntaxKind.GreaterThanGreaterThanEqualsToken: return ">>=";
            case ts.SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken: return ">>>=";
            case ts.SyntaxKind.AmpersandEqualsToken: return "&=";
            case ts.SyntaxKind.BarEqualsToken: return "|=";
            case ts.SyntaxKind.CaretEqualsToken: return "^=";  //LastAssignment
            case ts.SyntaxKind.BreakKeyword: return "break";
            case ts.SyntaxKind.CaseKeyword: return "case";
            case ts.SyntaxKind.CatchKeyword: return "catch";
            case ts.SyntaxKind.ClassKeyword: return "class";
            case ts.SyntaxKind.ConstKeyword: return "const";
            case ts.SyntaxKind.ContinueKeyword: return "continue";
            case ts.SyntaxKind.DebuggerKeyword: return "debugger";
            case ts.SyntaxKind.DefaultKeyword: return "default";
            case ts.SyntaxKind.DeleteKeyword: return "delete";
            case ts.SyntaxKind.DoKeyword: return "do";
            case ts.SyntaxKind.ElseKeyword: return "else";
            case ts.SyntaxKind.EnumKeyword: return "enum";
            case ts.SyntaxKind.ExportKeyword: return "export";
            case ts.SyntaxKind.ExtendsKeyword: return "extends";
            case ts.SyntaxKind.FinallyKeyword: return "finally";
            case ts.SyntaxKind.ForKeyword: return "for";
            case ts.SyntaxKind.FunctionKeyword: return "function";
            case ts.SyntaxKind.IfKeyword: return "if";
            case ts.SyntaxKind.ImportKeyword: return "import";
            case ts.SyntaxKind.InKeyword: return "in";
            case ts.SyntaxKind.InstanceOfKeyword: return "instanceof";
            case ts.SyntaxKind.NewKeyword: return "new";
            case ts.SyntaxKind.ReturnKeyword: return "return";
            case ts.SyntaxKind.SuperKeyword: return "super";
            case ts.SyntaxKind.SwitchKeyword: return "switch";
            case ts.SyntaxKind.ThrowKeyword: return "throw";
            case ts.SyntaxKind.TryKeyword: return "try";
            case ts.SyntaxKind.TypeOfKeyword: return "typeof";
            case ts.SyntaxKind.VarKeyword: return "var";
            case ts.SyntaxKind.VoidKeyword: return "void";
            case ts.SyntaxKind.WhileKeyword: return "while";
            case ts.SyntaxKind.WithKeyword: return "with";
            case ts.SyntaxKind.ImplementsKeyword: return "implements";
            case ts.SyntaxKind.InterfaceKeyword: return "interface";
            case ts.SyntaxKind.LetKeyword: return "let";
            case ts.SyntaxKind.PackageKeyword: return "package";
            case ts.SyntaxKind.PrivateKeyword: return "private";
            case ts.SyntaxKind.ProtectedKeyword: return "protected";
            case ts.SyntaxKind.PublicKeyword: return "public";
            case ts.SyntaxKind.StaticKeyword: return "static";
            case ts.SyntaxKind.YieldKeyword: return "yield";
            case ts.SyntaxKind.AsKeyword: return "as";
            case ts.SyntaxKind.ConstructorKeyword: return "constructor";
            case ts.SyntaxKind.DeclareKeyword: return "declare";
            case ts.SyntaxKind.GetKeyword: return "get";
            case ts.SyntaxKind.ModuleKeyword: return "module";
            case ts.SyntaxKind.RequireKeyword: return "require";
            case ts.SyntaxKind.SetKeyword: return "set";
            case ts.SyntaxKind.SymbolKeyword: return "symbol";
            case ts.SyntaxKind.TypeKeyword: return "type";
            case ts.SyntaxKind.FromKeyword: return "from";
            case ts.SyntaxKind.OfKeyword: return "of";
            case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
                return node.text;
*/
            default:
//                if (node.constructor.toString().match(/\w+/g)[1] === "Number") return node;
//                else;
                myContext.exitError("##!! error in expreession re-build curNode.kind=" + ((/**/<any>/**/ts).SyntaxKind[node.kind]) + "\t" + node.constructor.toString().match(/\w+/g)[1]);
        }
    };
    public toSource(nodeData: MyTsExprEvalType): string {
        var retVal:string = this.toSourceInner(nodeData,1);
        // debug traceLogger.trace("!!!!## debug toSource return=" + retVal);
        return retVal;
    };
    public toSourceInner(nodeData: MyTsExprEvalType, nestLevel:number): string {
        nestLevel ++;
        // debug traceLogger.trace("!!!!## debug toSourceInner type=" + typeof(nodeData) + " instanceof Array=" +(nodeData instanceof Array) + ",Nest_Level=" +nestLevel);
        if( nestLevel > 20){ //
            //myContext.exitError("##!! error too deep toSourceInner "+ this.nestLevel_toSource)); });
            return "*!! too complex !!*";
        }
        // debug dump traceLogger.trace(<any>nodeData);
        if ((typeof (nodeData) === "undefined")) {
            traceLogger.trace("!!## error in toSourceInner:" + typeof (nodeData));
            return "/** !! " + (typeof (nodeData)) + " **/";
        } else if(((!nodeData) === true) || (nodeData === null)){
            return "null";
        } else if ((nodeData instanceof Array)) {
            var retVals: string[] = [];
            for (var i: number = 0; i < nodeData.length; i++) {retVals.push(this.toSourceInner(nodeData[i],nestLevel));}
            return "[" + retVals.join(", ") + "]";
        } else if ((typeof (nodeData)) !== "object") {
            return "" + nodeData;
        } else if ((typeof (nodeData)) === "object") {
            var retVals: string[] = [];
            var retValType : string ="";
            if (Object.keys(nodeData).length === 0) {return "{}"; }
            var retType = { isArray: false, isVague: false, isObj: false, isScala: false, hasNoMenber: false };
            if (!(!(<MyTsExprEvalElement>nodeData).__value)) {
                if (((<MyTsExprEvalElement>nodeData).__value instanceof Array)) { // 曖昧な多値、または配列
                    for (var i: number = 0; i < (<MyTsExprEvalElement>nodeData).__value.length; i++) {
                        if (!(!(<MyTsExprEvalElement>nodeData).__value[i])) { retVals.push(this.toSourceInnerV((<MyTsExprEvalElement>nodeData).__value[i], nestLevel)); }
                    }
                    retType.isArray = true;
                    retType.isVague = !(!(<MyTsExprEvalElement>nodeData).__vague);
                } else if (typeof ((<MyTsExprEvalElement>nodeData).__value) === "object") {
                    for (var e in (<MyTsExprEvalElement>nodeData).__value) {
                        if (e !== "__PickUp" && e !== "__value" && e !== "__vague" && e !== "__type") {
                            retVals.push(e + ": " + this.toSourceInner((<MyTsExprEvalElement>nodeData).__value[e],nestLevel));
                        }
                    }
                    retType.isObj = true;
                } else {
                    retVals.push(this.toSourceInner((<MyTsExprEvalElement>nodeData).__value,nestLevel));
                    retType.isScala = true;
                }
                if(!(!(nodeData["__value"]["__type"])) && nodeData["__value"]["__type"].length > 0) {
                    retValType = "<" + nodeData["__value"]["__type"] + ">";
                }
            }
            if(!(!(<MyTsExprEvalElement>nodeData).__type) && (<MyTsExprEvalElement>nodeData).__type.length > 0){ retValType = "<" + (<MyTsExprEvalElement>nodeData).__type + ">" ;}
            var preValueCount:number = retVals.length;
            for (var e in <any>nodeData) {
                if (e !== "__PickUp" && e !== "__value" && e !== "__vague" && e !== "__type") {
                    retVals.push(e + ": " + this.toSourceInnerV(nodeData[e],nestLevel));
                }
            }
            retType.isObj = retType.isObj || (retVals.length > preValueCount);
            retType.isVague =  retType.isVague || (retType.isObj && retType.isScala);
            if(retType.isVague && (retVals.length > 1)){  // スカラーまたは配列値とobjectliterialの値の両方が設定されている
                var retVal = "{|" + retVals.join(" |,| ") + "|} "; // 式展開が前方空白無{...}.propertyの場合オブジェクト展開を取り消す
            } else if(retType.isObj){
                retVal = retValType + "{" + retVals.join(", ") + "}";
            } else if(retType.isArray){
                retVal = "[" + retVals.join(", ") + "]";
            } else if(retVals.length === 0){
                retVal = retValType + "{}";
            } else if(retType.isScala || retType.isVague ) {
                retVal = retVals[0];
            } else {
                traceLogger.debug("!!## debug in toSource : typeOf(nodeData)=" + typeof(nodeData),nodeData);
                retVal = "{/**!!(" + typeof(nodeData) + ")!!**/}";
            }
            return retVal;
        }  else {
            errorLogger.error("!!## error in toSourceInner not support type",nodeData);
            myContext.exitError("##!! error in toSourceInner error not support type");
        }
    };
    /** 曖昧な多値の代表値のみ文字列化する関数。　代入文の右辺用**/
    public toSourceV(nodeData: MyTsExprEvalType): string {
        var retVal:string = this.toSourceInnerV(nodeData,1);
        // debug traceLogger.trace("!!!!## debug toSource return=" + retVal);
        return retVal;
    };
    public toSourceInnerV(nodeData: MyTsExprEvalType, nestLevel:number): string {
        nestLevel ++;
        // debug traceLogger.trace("!!!!## debug toSourceInner type=" + typeof(nodeData) + " instanceof Array=" +(nodeData instanceof Array) + ",Nest_Level=" +nestLevel);
        if( nestLevel > 20){ //
            //myContext.exitError("##!! error too deep toSourceInner "+ this.nestLevel_toSource)); });
            return "*!! too complex !!*";
        }
        // debug dump traceLogger.trace(<any>nodeData);
        if ((typeof (nodeData) === "undefined")) {
            traceLogger.trace("!!## error in toSourceInner:" + typeof (nodeData));
            return "/** !! " + (typeof (nodeData)) + " **/";
        } else if(((!nodeData) === true) || (nodeData === null)){
            return "null";
        } else if ((nodeData instanceof Array)) {
            var retVals: string[] = [];
            for (var i: number = 0; i < nodeData.length; i++) {retVals.push(this.toSourceInnerV(nodeData[i],nestLevel));}
            return "[" + retVals.join(", ") + "]";
        } else if ((typeof (nodeData)) !== "object") {
            return "" + nodeData;
        } else if ((typeof (nodeData)) === "object") {
            var retVals: string[] = [];
            var retValType : string ="";
            if (Object.keys(nodeData).length === 0) {return "{}";}
            var retType = { isArray: false, isVague: false, isObj: false, isScala: false, hasNoMenber: false };
            if (!(!(<MyTsExprEvalElement>nodeData).__value)) {
                if (((<MyTsExprEvalElement>nodeData).__value instanceof Array)) { // 曖昧な多値、または配列
                    if (!(!((<MyTsExprEvalElement>nodeData).__vague)) && (<MyTsExprEvalElement>nodeData).__value.length > 0) {
                        if ((<MyTsExprEvalElement>nodeData).__value.length > 2) { //　曖昧な多値が　{|変数名 |,| 初期設定値 |,| 初期化(null,'') |}が設定されると仮定し、文字数が多い一つの値のみ残す
                            var lengthTotal:number = 0;
                            var lengthMax:number = -1;
                            var maxLengthStr ="";
                            for (var i: number = 0; i < (<MyTsExprEvalElement>nodeData).__value.length; i++) {
                                if (!(!(<MyTsExprEvalElement>nodeData).__value[i]) || (<MyTsExprEvalElement>nodeData).__value[i] === false) {
                                    var curStr:string = this.toSourceInnerV((<MyTsExprEvalElement>nodeData).__value[i], nestLevel);
                                    if(lengthMax < curStr.length){lengthMax = curStr.length; maxLengthStr = curStr;}
                                    lengthTotal += curStr.length;
                                    retVals.push(curStr);
                                }
                            }
                            if(lengthTotal > 255){retVals = [maxLengthStr];} //全体が長すぎる場合、最大長の１個だけにする。　{|true|,|false|}のように短い多値は返す
                        } else if ((<MyTsExprEvalElement>nodeData).__value.length === 2) {
                            retVals = [this.toSourceInnerV((<MyTsExprEvalElement>nodeData).__value[0], nestLevel),
                                this.toSourceInnerV((<MyTsExprEvalElement>nodeData).__value[(<MyTsExprEvalElement>nodeData).__value.length - 1], nestLevel)];
                            if(retVals[0].length + retVals[1].length > 255){
                                if (retVals[0].length < retVals[1].length) { retVals.shift(); } else { retVals.pop(); }
                            }
                        } else {
                            retVals.push(this.toSourceInnerV((<MyTsExprEvalElement>nodeData).__value[0], nestLevel));
                        }
                        retType.isVague = true;
                    } else {
                        for (var i: number = 0; i < (<MyTsExprEvalElement>nodeData).__value.length; i++) {
                            if (!(!(<MyTsExprEvalElement>nodeData).__value[i])) { retVals.push(this.toSourceInnerV((<MyTsExprEvalElement>nodeData).__value[i], nestLevel)); }
                        }
                        retType.isArray = true;
                    }
                } else if (typeof ((<MyTsExprEvalElement>nodeData).__value) === "object") {
                    for (var e in (<MyTsExprEvalElement>nodeData).__value) {
                        if (e !== "__PickUp" && e !== "__value" && e !== "__vague" && e !== "__type") {
                            retVals.push(e + ": " + this.toSourceInnerV((<MyTsExprEvalElement>nodeData).__value[e], nestLevel));
                        }
                    }
                    retType.isObj = true;
                } else {
                    retVals.push(this.toSourceInnerV((<MyTsExprEvalElement>nodeData).__value,nestLevel));
                    retType.isScala = true;
                }
                if(!(!(nodeData["__value"]["__type"])) && nodeData["__value"]["__type"].length > 0) {
                    retValType = "<" + nodeData["__value"]["__type"] + ">";
                }
            }
            if(!(!(<MyTsExprEvalElement>nodeData).__type) && (<MyTsExprEvalElement>nodeData).__type.length > 0){ retValType = "<" + (<MyTsExprEvalElement>nodeData).__type + ">" ;}
            var preValueCount:number = retVals.length;
            for (var e in <any>nodeData) {
                if (e !== "__PickUp" && e !== "__value" && e !== "__vague" && e !== "__type") {
                    retVals.push(e + ": " + this.toSourceInnerV(nodeData[e],nestLevel));
                }
            }
            if(!(!(nodeData["__type"])) && nodeData["__type"].length > 0) {
                retValType = "<" + nodeData["__type"] + ">";
            }
            retType.isObj = retType.isObj || (retVals.length > preValueCount);
            retType.isVague =  retType.isVague || (retType.isObj && retType.isScala);
            if(retType.isVague && (retVals.length > 0)){  // スカラーまたは配列値とobjectliterialの値の両方が設定されている
                var retVal = "{|" + retVals.join(" |,| ") + "|} "; // 式展開が前方空白無{...}.propertyの場合オブジェクト展開を取り消す
            } else if(retType.isObj){
                retVal = retValType + "{" + retVals.join(", ") + "}";
            } else if(retType.isArray){
                retVal = "[" + retVals.join(", ") + "]";
            } else if(retVals.length === 0){
                retVal = retValType + "{}";
            } else if(retType.isScala || retType.isVague ) {
                retVal = retVals[0];
            } else {
                traceLogger.debug("!!## debug in toSourceInnerV : typeOf(nodeData)=" + typeof(nodeData), nodeData);
                retVal = "{/**!!(" + typeof(nodeData) + ")!!**/}";
            }
            return retVal;
        }  else {
            errorLogger.error("!!## error in toSourceInnerV not support type", nodeData);
            myContext.exitError("##!! error in toSourceInner error not support type");
        }
    };
    public getTypeStr(nodeData: MyTsExprEvalType): string {
        if(!(!nodeData)){
            if(!(!(<MyTsExprEvalElement>nodeData).__type) && (<MyTsExprEvalElement>nodeData).__type.length > 0){ return (<MyTsExprEvalElement>nodeData).__type;}
            else if(!(!(<MyTsExprEvalElement>nodeData).__value)) {return typeof((<MyTsExprEvalElement>nodeData).__value);}
            else {return typeof((<MyTsExprEvalElement>nodeData));}
        } else {
            return typeof(nodeData);
        }
    };
    public getSymbolList(node: ts.Expression): string[] {  //左辺値
        var strArr: string[];
        switch (node.kind) {
            case ts.SyntaxKind.ThisKeyword:
                return ["this"];
            case ts.SyntaxKind.Identifier:
                return [node.getText()];
            case ts.SyntaxKind.ParenthesizedExpression:
            case ts.SyntaxKind.TypeAssertionExpression:
                return this.getSymbolList((<ts.ParenthesizedExpression>node).expression);
            case ts.SyntaxKind.ElementAccessExpression:
                strArr = this.getSymbolList((<ts.ElementAccessExpression>node).expression);
                strArr.push("[" + this.toSource(this.getObjectVal((<ts.ElementAccessExpression>node).argumentExpression)) + "]");
                return strArr;
            case ts.SyntaxKind.PropertyAccessExpression:
                strArr = this.getSymbolList((<ts.PropertyAccessExpression>node).expression);
                strArr.push((<ts.PropertyAccessExpression>node).name.getText());
                return strArr;
            case ts.SyntaxKind.CallExpression:
                strArr = this.getSymbolList((<ts.CallExpression>node).expression);
                var p = "(";
                if ((<ts.CallExpression>node).arguments.length > 0) {
                    var objStr: string = this.toSource(this.getObjectVal((<ts.CallExpression>node).arguments[0]));
                    if (objStr.length > 3900) {objStr = "/**" + curTypeChecker.typeToString(curTypeChecker.getTypeAtLocation(node)) + "**/" + this.toSource(this.getObjectValE((<ts.CallExpression>node).arguments[0], expandValLevel.expandValLevelNoID));}
                    p += objStr;
                    for (var i: number = 1; i < (<ts.CallExpression>node).arguments.length; i++) {
                        objStr = this.toSource(this.getObjectVal((<ts.CallExpression>node).arguments[i]));
                        if (objStr.length > 3900) {objStr = "/**" + curTypeChecker.typeToString(curTypeChecker.getTypeAtLocation(node)) + "**/" + this.toSource(this.getObjectValE((<ts.CallExpression>node).arguments[i], expandValLevel.expandValLevelNoID));}
                        p += ", " + objStr;
                    }
                }
                p += ")";
                strArr.push(p);
                return strArr;
            default:
                myContext.exitError("##!! error in expreession getSymbolList curNode.kind=" + ((/**/<any>/**/ts).SyntaxKind[node.kind]) + "\t" + node.constructor.toString().match(/\w+/g)[1]);
        }
        return [];
    };
    setValExprAnyVal(lValNode: ts.Expression, rValObject: any) { // for function arguments,valiable-declare
        "use strict";
        var lValSymbols: string[] = myTsExprEval.getSymbolList(lValNode);
        myContext.setValSymbols2AnyVal(lValSymbols, rValObject);
    };
    setValExpr(lValNode: ts.Expression, rValNode: any) { // for function arguments,valiable-declare
        var rValObject: any = myTsExprEval.getObjectVal(rValNode);
        this.setValExprAnyVal(lValNode, rValObject);
    }
    meargeObjectsItems(lValObject: MyTsExprEvalType, operatorTokenStr: string, rValObject: MyTsExprEvalType): MyTsExprEvalType {
        /* debug */var debugFLG: boolean = true;
        var toBePickup: boolean = false; //(!(!(<MyTsExprEvalElement>lValObject).__PickUp) && (<MyTsExprEvalElement>lValObject).__PickUp === true);
        /* debug */ if (debugFLG){ traceLogger.trace("!!## debug updateValExpr.meargeObjectsItems enter :" + operatorTokenStr + " " + toBePickup);}
        /* debug */ if (debugFLG){ traceLogger.trace("!!## debug updateValExpr.meargeObjectsItems lValObject=",lValObject);}
        /* debug */ if (debugFLG){ traceLogger.trace("!!## debug updateValExpr.meargeObjectsItems rValObject=",rValObject);}
        var lValObjectValue: any[] = [];
        var retObjectVal: MyTsExprEvalElement = <MyTsExprEvalElement>{ __PickUp: toBePickup, __value: lValObjectValue, __vague: !(!lValObject.__vague), __type: rValObject.__type || lValObject.__type };
        if ((typeof (lValObject) === "object") && !(lValObject instanceof Array)) {
            for (var e in lValObject) {retObjectVal[e] = lValObject[e];}
        }
        if ((typeof (rValObject) === "object") && !(rValObject instanceof Array)) {
            for (var e in rValObject) {
                if (e === "__PickUp" || e === "__vague") {
                    if (!(!rValObject[e])) {retObjectVal[e] = true;}
                } else if (e === "__type") {
                    retObjectVal[e] = rValObject[e];
                } else if (e !== "__value") {
                    if ((!retObjectVal[e]) || (typeof (retObjectVal[e]) === "undefined")) { retObjectVal[e] = rValObject[e]; }
                    else {
                        retObjectVal[e] = this.meargeObjectsItems(retObjectVal[e], operatorTokenStr, rValObject[e]);
                    }
                }
            }
        }
        if (!(!lValObject) && (lValObject instanceof Array)) {
            lValObjectValue = lValObject.concat();
        } else if (!(!(<MyTsExprEvalElement>lValObject).__value) && ((<MyTsExprEvalElement>lValObject).__value instanceof Array)) {
            lValObjectValue = (<MyTsExprEvalElement>lValObject).__value.concat();
        } else {
            if (!(lValObject)) {
                lValObjectValue = [];
            } else {
                lValObjectValue = [myTsExprEval.toSourceV(lValObject)];
                if (typeof (lValObjectValue[0]) === "undefined" || lValObjectValue[0] === "/** !! undefined **/") {lValObjectValue = [];}
            }
        }
        var rValObjectValue = (!(!(<MyTsExprEvalElement>rValObject).__value)) ? (<MyTsExprEvalElement>rValObject).__value : rValObject;
        /* debug */ if (debugFLG){ traceLogger.trace("!!## debug updateValExpr.meargeObjectsItems rValObjectValue=", rValObjectValue);}
        if (!(!rValObjectValue) && (rValObjectValue instanceof Array)) {
            for (var i: number = 0; i < rValObjectValue.length; i++) {
                if (lValObjectValue.indexOf(rValObjectValue[i]) < 0){
                    lValObjectValue.push(operatorTokenStr + this.toSourceV(rValObjectValue[i]));
                    retObjectVal.__vague = true;
                }
            }
        } else if ((typeof (rValObjectValue) === "string")) {
            if (lValObjectValue.indexOf(rValObjectValue) < 0) {lValObjectValue.push(operatorTokenStr + (rValObjectValue));}
            retObjectVal.__vague = true;
        } else if (!(!rValObjectValue)) {
            retObjectVal.__vague = true;
            /* debug */ if (!(!rValObjectValue)) {traceLogger.trace("!!## debug updateValExpr.meargeObjectsItems rValObjectValue skip value :", rValObjectValue);}
            if (lValObjectValue.indexOf(rValObjectValue) < 0) {lValObjectValue.push(operatorTokenStr + this.toSourceV(rValObjectValue));}
        }
        retObjectVal.__value = lValObjectValue;
        /* debug */ if (debugFLG) {traceLogger.trace("!!## debug updateValExpr.meargeObjectsItems returns :", retObjectVal);}
        return retObjectVal;
    }
    updateValExpr(lValNode: ts.Expression, operator: string, rValNode: ts.Expression, rValTypeStr: string): MyTsExprEvalType { // for assign ,valiable -declare init
        "use strict";
        var rValNeedsPickup: boolean = rValTypeStr.indexOf(" => ") > 0;
        var lValObject: MyTsExprEvalType = myTsExprEval.getObjectVal(lValNode); //更新前の値を得る。　　曖昧な多値は全部得る
        var toBePickup: boolean = (!(!(<MyTsExprEvalElement>lValObject).__PickUp) && (<MyTsExprEvalElement>lValObject).__PickUp === true);

        if (operator !== "=" || (toBePickup && (!myContext.isInConstructor()))) {
            var rValObject: MyTsExprEvalType = <MyTsExprEvalElement>myTsExprEval.getObjectValR(rValNode); //更新後の値を得る。　曖昧な多数の値は、初期値のみ得る
            //if ((!(!(<MyTsExprEvalElement>rValObject).__PickUp) && (<MyTsExprEvalElement>rValObject).__PickUp === true) || (myContext.pickUpValRefed.length > 0) || rValNeedsPickup){ toBePickup = true;}
            var operatorStr = (operator.length > 1) ? operator.slice(0, -1) + " ": "";
            rValObject = this.meargeObjectsItems(lValObject, operatorStr, rValObject); // マージした値で　上書き
            var curType = (rValTypeStr.length > 0) ? rValTypeStr : (rValObject.__type.length > 0) ? rValObject.__type : "";
            rValObject["__type"] = curType; // マージ済みのlValObject.__typeとrValObject.__typeに　文脈情報で上書き
        } else {
            var rValObject: MyTsExprEvalType = <MyTsExprEvalElement>myTsExprEval.getObjectVal(rValNode); //更新後の値を得る。　曖昧な多数の値は、全部得る
            var curType = (rValTypeStr.length > 0) ? rValTypeStr : (rValObject.__type.length > 0) ? rValObject.__type : (lValObject.__type.length > 0) ? lValObject.__type : "";
        }
        this.setValExprAnyVal(lValNode, rValObject);
        lValObject = myTsExprEval.getObjectVal(lValNode);
        lValObject["__type"] = curType;
        /* debug */ traceLogger.trace("!!## debug updateValExpr updated:", lValObject);
        return lValObject; //更新された値へのオブジェクト参照を返す
    };
    pushValExpr(lValNode: ts.Expression, rValNode: ts.Expression, rValTypeStr: string) {
        var lValObject = myTsExprEval.getObjectVal(lValNode);
        var rValObject = myTsExprEval.getObjectVal(rValNode);
        var lValObjectValue:MyTsExprEvalElement =<MyTsExprEvalElement>{ __PickUp: false, __value: [], __vague: true, __type: rValTypeStr + "[]"};
        if (!lValObject) {lValObjectValue.__value.push(lValObject);}
        else if ((lValObject instanceof Array)) {lValObjectValue.__value = lValObject.concat();}
        else if (typeof(lValObject) === "object") {
            lValObjectValue.__value.push(this.toSource(lValObject));
//            if(!(!(<MyTsExprEvalElement>lValObject)["__value"])){
//                if(((<MyTsExprEvalElement>lValObject).__value instanceof Array)) lValObjectValue = <MyTsExprEvalElement>{ __PickUp: !(!lValObject["__PickUp"]), __value: (<MyTsExprEvalElement>lValObject).__value.concat(), __vague: true, __type: rValTypeStr + "[]"};
//                else {
//                    lValObjectValue = <MyTsExprEvalElement>{ __PickUp: !(!lValObject["__PickUp"]), __value: [], __vague: true, __type: rValTypeStr + "[]"};
//                    lValObjectValue.__value.push((<MyTsExprEvalElement>lValObject).__value);
//                }
//            } else lValObjectValue.__value.push(lValObject);
        } else {
            lValObjectValue.__value.push(lValObject);
        }
        //traceLogger.error(lValObjectValue.__value);
        console.error(lValObjectValue.__value);
        lValObjectValue.__value.push(rValObject);
        /* debug */ traceLogger.trace("!!## debug pushValExpr #1 pushed");
        //object dump traceLogger.trace(lValObjectValue);
        this.setValExprAnyVal(lValNode, lValObjectValue);
    };
    convertFuncType2JSComments(curType: string,o:string[]): string[] {
        var regexp1: RegExp= /\(([\w_$@#\?]+):\s*([\w_$@#\[\]<>\? ]+)(,\s*([\w_$@#\?]+):\s*([\w_$@#\[\]<>\? ]+))*\)/g;
        var regexp2: RegExp = / => ([\w_$@#\[\]<>\?]+)$/;
        var r: string[] = o;
        var margs = regexp1.exec(curType);
        if ((margs instanceof Array) && (margs.length > 2)) {
            for (var i = 1; i < (margs.length); i +=3) {
                if(!(!margs[i])) {r.push("(@param)?\\W+" + margs[i] + " *\\W+");}
            }
        }
        margs = regexp2.exec(curType);
        if ((margs instanceof Array) && (typeof(margs[1]) === "string") && (margs[1] !== "void")) {r.push("@return ");}
        return r;
    };
};
interface MyCalleeNameIF{
    className: string;
    methodName: string;
};
class MyTsAst2XrefClass  {
    curRuleWorker: Lint.RuleWalker;
    callNames: string[] =[];
    valueExpand: boolean = true;
    checkVauge: boolean = true;
    ajgularModuleVarName: string[] = [];
    deferedBindName:string[] =[];
    // targetMethodStr === "$inject" && ts.SyntaxKind.PropertyDeclaration
    // targetMethodStr === "$inject" && ts.SyntaxKind.PropertyAccessExpression
    // targetMethodStr === "registration" && ts.SyntaxKind.VariableDeclaration
    // (curNode.kind === ts.SyntaxKind.ArrayLiteralExpression) targetArgsNodesArray.elements[targetArgsNodesArray.elements.length - 1];
    pre_$inject(targetNode: ts.Identifier | ts.Expression, targetArgsNodesArray: ts.ArrayLiteralExpression, elementsLengthOffset: number): void {
        var targetClassNameStr: string = "";
        if (targetNode.kind === ts.SyntaxKind.ArrowFunction) {
            targetClassNameStr = curTypeChecker.typeToString(curTypeChecker.getTypeAtLocation((<ts.ArrowFunction>targetNode).body));
            if (targetClassNameStr === "any" || targetClassNameStr[0] === "{") {
                targetClassNameStr = targetNode.getText();
                var rege = targetClassNameStr.match(/\s+new\s+(\w[a-zA-Z0-9@_#]+)/);
                if (!(!rege)) { targetClassNameStr = rege[1]; }
            }
            if (!targetClassNameStr.match(/^[\w$@#_]+$/)) { targetClassNameStr = ""; }
        } else if (targetNode.kind === ts.SyntaxKind.Identifier) {
            targetClassNameStr = targetNode.getText();
        } else { ; }
        if (targetClassNameStr.length > 0) {
            var objs = [];
            for (var i: number = 0; i < targetArgsNodesArray.elements.length - elementsLengthOffset; i++) {
                var targetObjStr: string = targetArgsNodesArray.elements[i].getText();
                if (targetObjStr[0] === "\"" && targetObjStr.slice(-1) === "\"") {
                    targetObjStr = "'" + targetObjStr.slice(1, -1) + "'";
                }
                objs.push(targetObjStr);
            }
            myContext.setValSymbols2AnyValG([targetClassNameStr, "$inject"], objs);
            traceLogger.trace("#" + ":\t" + " !!## findPreferedDef setValSymbols2AnyValG#9([" + targetClassNameStr + "," + "$inject]=", objs);
        }
    };
        /**
     * TS.Class TS.Interface    情報を抽出
     *  if (parentNode.kind === ts.SyntaxKind.ClassDeclaration)
     *  if (parentNode.kind === ts.SyntaxKind.InterfaceDeclaration)
     */
    rem_define_TsClass(targetNode: ts.Identifier, parentNode: ts.ClassDeclaration | ts.InterfaceDeclaration, curTypeStr: string): void {
        var curIdStr: string = targetNode.getText();
        myContext.setValSymbols2AnyValG([curIdStr], { __type: curIdStr } /*{__PickUp:true, __value:curIdStr, __vague:false}*/);
        myContext.setValSymbols2NewValC(["this"], myContext.getValSymbols2AnyValG([curIdStr]));
    };
    /** "TS.PropertyDefined"情報を抽出
     * if (curNode.kind === ts.SyntaxKind.PropertyDeclaration) &&
     * if (parentNode.kind === ts.SyntaxKind.ClassDeclaration || parentNode.kind === ts.SyntaxKind.InterfaceDeclaration) {
     */
    rem_TS_PropertyDeclaration(targetNode: ts.PropertyDeclaration, parentNode: ts.Declaration): void {
            if (parentNode.kind === ts.SyntaxKind.ClassDeclaration || parentNode.kind === ts.SyntaxKind.InterfaceDeclaration) {
                var targetClassName: string = ((<ts.ClassDeclaration>parentNode).name).getText();
                var targetPropertyName: string = ((<ts.PropertyDeclaration>targetNode).name).getText();
                var typeOfExpressionR:string  = curTypeChecker.typeToString(curTypeChecker.getTypeAtLocation(((<ts.PropertyDeclaration>targetNode))));
                var objPreValue = targetClassName + "." + targetPropertyName;
                var preInjecValue = myContext.getValSymbols2AnyValG([targetClassName, targetPropertyName]);
                var newValue = ((<ts.ClassDeclaration>parentNode).name).getText() + "." + ((<ts.PropertyDeclaration>targetNode).name).getText();
                if ((!preInjecValue) || (preInjecValue === objPreValue /* initializer無*/ && preInjecValue !== newValue)) {
                    myContext.setValSymbols2AnyValG([targetClassName, targetPropertyName], newValue);
                }
            }
            if (!(!((<ts.PropertyDeclaration>targetNode).initializer))) {
                var parentId: string = "";
                if (!(!(<ts.Declaration>parentNode).name)) {parentId = ((<ts.Declaration>parentNode).name).getText();}
                if (parentId !== "") {
                    var targetClass: string = parentId;
                    var targetMethod: string = ((<ts.PropertyDeclaration>targetNode).name).getText();
                } else {
                    var targetClass: string = ((<ts.PropertyDeclaration>targetNode).name).getText();;
                    targetMethod = "";
                }
                var exprRight: any = //((<ts.PropertyDeclaration>targetNode).initializer).getText()
                    myTsExprEval.getObjectVal((<ts.PropertyDeclaration>targetNode).initializer);
                var exprRightFormated: string = myTsExprEval.toSource(exprRight);
                var typeOfExpressionR = curTypeChecker.typeToString(curTypeChecker.getTypeAtLocation(((<ts.PropertyDeclaration>targetNode).initializer)));
                myTsExprEval.setValExpr(<ts.Identifier>(<ts.PropertyDeclaration>targetNode).name, (<ts.PropertyDeclaration>targetNode).initializer);
            }
    };
    /** "TS.PropertyDefined"情報を抽出
     * if (parentNode.kind === ts.SyntaxKind.PropertySignature || parentNode.kind === ts.SyntaxKind.PropertyDeclaration || parentNode.kind === ts.SyntaxKind.PropertyAssignment || parentNode.kind === ts.SyntaxKind.GetAccessor)
     */
    rem_TS_PropertyDefined(targetNode: ts.Identifier, parentNode: ts.Declaration): void {
        var curIdStr: string = targetNode.getText();
        var parentIdStr: string = "";
        var parentIdSymbols: string[] = [];
        if (!(!(<ts.Declaration>parentNode.parent).name)) {
            parentIdSymbols = [((<ts.Declaration>parentNode.parent).name).getText(), curIdStr];
            parentIdStr = parentIdSymbols[0];
        } else if (parentNode.parent.kind === ts.SyntaxKind.ObjectLiteralExpression &&
            parentNode.parent.parent.kind === ts.SyntaxKind.ReturnStatement &&
            parentNode.parent.parent.parent.kind === ts.SyntaxKind.Block &&
            parentNode.parent.parent.parent.parent.kind === ts.SyntaxKind.GetAccessor &&
            parentNode.parent.parent.parent.parent.parent.kind === ts.SyntaxKind.ClassDeclaration) {
            parentIdSymbols = [(<ts.ClassDeclaration>(parentNode.parent.parent.parent.parent.parent)).name.getText(), (<ts.ClassDeclaration>(parentNode.parent.parent.parent.parent)).name.getText(), curIdStr];
            parentIdStr = parentIdSymbols[0] + "." + parentIdSymbols[1];
        } else if (parentNode.parent.kind === ts.SyntaxKind.ObjectLiteralExpression &&
            parentNode.parent.parent.kind === ts.SyntaxKind.VariableDeclaration) {
            parentIdSymbols = [(<ts.VariableDeclaration>(parentNode.parent.parent)).name.getText(), curIdStr];
            parentIdStr = parentIdSymbols[0]; //+ "." + parentIdSymbols[1];
        } else if (parentNode.parent.kind === ts.SyntaxKind.ObjectLiteralExpression ) {
            // parentNode.parent.parent.kind === ts.SyntaxKind.CallExpression my be  .constant('InitialParameters', { ConstantProperty  : args  }) -> CallExpressionで処理される
        } else if (parentNode.parent.kind === ts.SyntaxKind.TypeLiteral){;
        } else { myContext.exitError("!!## not support Property declaretion :parentNode.parent.kind=" + ((/**/<any>/**/ts).SyntaxKind[parentNode.parent.kind]) + " , parentNode.parent.parent.kind=" + ((/**/<any>/**/ts).SyntaxKind[parentNode.parent.parent.kind])); }
        var typeOfExpressionR:string  = curTypeChecker.typeToString(curTypeChecker.getTypeAtLocation(targetNode));
        var argValObjs= null;
        var argsInfoStr:string = "";
        if (!(!(<ts.PropertyAssignment>parentNode).initializer)) {
            argValObjs = myTsExprEval.getObjectVal((<ts.PropertyAssignment>parentNode).initializer);
            argsInfoStr = myTsExprEval.toSource(argValObjs);
        }
        if (parentIdStr.length > 0) {
            if (argsInfoStr.length === 0) { argsInfoStr = "(<" + typeOfExpressionR + ">" + parentIdStr + "." + curIdStr + ")"; }
            myContext.setValSymbols2AnyValG(parentIdSymbols, argValObjs);
        } else {
            if (argsInfoStr.length === 0) { argsInfoStr = "(<" + typeOfExpressionR + ">" + curIdStr + ")"; }
            myContext.setValSymbols2NewValC([curIdStr], argValObjs);
        }
    };
    /** "TS.VariableDeclaration"の初期値を記憶する。
     * 右辺値に多重代入文が在った場合、代入後の値を伝搬させる為、右辺値の評価後に実行されるonLeaveから呼び出す。
     * if (parentNode.kind === ts.SyntaxKind.VariableDeclaration)
     */
    rem_TS_VariableDeclaration_initValue(targetNode: ts.Identifier, exprRightNOde: ts.Expression): void {
        if ((!exprRightNOde)) { // no initializer
            var curType = curTypeChecker.typeToString(curTypeChecker.getTypeAtLocation(targetNode));
            var exprRightVal:any = <MyTsExprEvalElement>{ __type: curType };
        } else {
            var exprRightVal:any = myTsExprEval.getObjectVal(exprRightNOde);
        }
        var targetClass: string = targetNode.getText();
        myContext.setValSymbols2NewValC([targetClass], exprRightVal);
    };
    /** "define.Parameter"情報の抽出 および
     *  Parameter.initでの初期値処理
     *  if (ts.SyntaxKind.Parameter === curNode.kind)       
     */
    rem_define_Parameter(targetNode: ts.ParameterDeclaration, parentNode: ts.Node): void {
        var targetClass = "";
        var targetMethod: string;
        if (parentNode.kind === ts.SyntaxKind.Constructor && parentNode.parent.kind === ts.SyntaxKind.ClassDeclaration) {
            targetClass = "/*<" + (<ts.ClassDeclaration>parentNode.parent).name.getText() + ">*/ this.";
            targetMethod = targetNode.name.getText();
        } else if (parentNode.kind === ts.SyntaxKind.CallSignature && parentNode.parent.kind === ts.SyntaxKind.InterfaceDeclaration) {
            targetClass = "/*<" + (<ts.InterfaceDeclaration>parentNode.parent).name.getText() + ">*/ this.";
            targetMethod = targetNode.name.getText();
        } else if (parentNode.kind === ts.SyntaxKind.MethodDeclaration || parentNode.kind === ts.SyntaxKind.MethodSignature) {
            targetClass = ((<ts.MethodDeclaration>parentNode).name).getText();
            targetMethod = targetNode.name.getText();
        } else if ((parentNode.kind === ts.SyntaxKind.ArrowFunction || parentNode.kind === ts.SyntaxKind.FunctionExpression) && (parentNode.parent.kind === ts.SyntaxKind.VariableDeclaration || parentNode.parent.kind === ts.SyntaxKind.PropertyDeclaration)) {
            targetClass = (<ts.VariableDeclaration>parentNode.parent).name.getText();
            targetMethod = targetNode.name.getText();
        } else {
            targetClass = targetNode.name.getText();
            targetMethod = "";
        }
        var typeOfExpressionL: string = curTypeChecker.typeToString(curTypeChecker.getTypeAtLocation(targetNode), undefined, ts.TypeFormatFlags.UseFullyQualifiedType);
        if (parentNode.kind === ts.SyntaxKind.Constructor) {// define parm to default gloval value
            var curClassName: string = (<ts.ClassDeclaration>(parentNode.parent)).name.getText();
            var curParmName: string = ((targetNode).name).getText();
            var curParmInjecesName = "'" + curParmName + "'";
            for (var argIndex: number = 0; argIndex < (<ts.ConstructorDeclaration>parentNode).parameters.length && (<ts.ConstructorDeclaration>parentNode).parameters[argIndex] !== targetNode; argIndex++) { ; }
            var bindObjects = myContext.getValSymbols2AnyValG([curClassName, "$inject"]);
            if (!(!bindObjects.__value) && (bindObjects.__value instanceof Array) && (bindObjects.__value.length > argIndex) && (typeof (bindObjects.__value[argIndex]) === "string")) {
                if (curParmInjecesName.toLowerCase() !== bindObjects.__value[argIndex].toLowerCase() &&
                    ("\"" + curParmName.toLowerCase() + "\"") !== bindObjects.__value[argIndex].toLowerCase()) {
                    errorLogger.warn(" !!## WARNNING! Constructor to inject parameter name not mutch : " + curClassName + "." + curParmInjecesName + "!==" + bindObjects.__value[argIndex]);
                    errorLogger.warn(bindObjects);
                }
                curParmInjecesName = bindObjects.__value[argIndex];
                if (curParmInjecesName[0] === "\"" && curParmInjecesName.slice(-1) === "\"") { curParmInjecesName = "'" + curParmInjecesName.slice(1, -1) + "'"; }
                bindObjects = myContext.getValSymbols2AnyValG([curParmInjecesName]);
                myContext.setValSymbols2AnyValG([curClassName, curParmName], bindObjects);
            } else {
                if (!(!this.deferedBindName[curClassName])) {
                    traceLogger.trace(" !!## WARNNING! Constructor to inject parameter name : " + this.deferedBindName[curClassName] + "." + curParmInjecesName);
                    bindObjects = myContext.getValSymbols2AnyValG([curParmInjecesName]);
                    myContext.setValSymbols2AnyValG([curClassName, curParmName], bindObjects);
                } else {
                    traceLogger.trace("!!## debug " + curClassName + " of " + ((<ts.ConstructorDeclaration>parentNode).parameters.length) + " at " + argIndex + "St parm of " + curParmInjecesName + " of Constructor Parameter has not $inject; deferedBindName=" + this.deferedBindName[curClassName]);
                    // debug dump traceLogger.trace(bindObjects);
                    bindObjects = { __PickUp: true, __value: curClassName + "." + curParmName, __vague: false };
                    myContext.setValSymbols2AnyValG([curClassName, curParmName], bindObjects);
                    bindObjects = myContext.getValSymbols2AnyValG([curClassName, curParmName]);  // get refferance
                }
            }
            myContext.setValSymbols2AnyVal(["this", curParmName], bindObjects); //set cur class member
            myContext.setValSymbols2NewValC([curParmName], bindObjects); //set Constructor local var        
        } else if (parentNode.kind === ts.SyntaxKind.ArrowFunction && parentNode.parent.kind === ts.SyntaxKind.ArrayLiteralExpression
            && ((<ts.ArrowFunction>parentNode).parameters.length === ((<ts.ArrayLiteralExpression>(parentNode.parent)).elements.length - 1))) {// define parm to default gloval value
            for (var argIndex: number = 0; (<ts.ArrowFunction>parentNode).parameters[argIndex] !== targetNode; argIndex++) { ; }
            var valRefObj = myContext.getValSymbols2AnyValG([(<ts.ArrayLiteralExpression>(parentNode.parent)).elements[argIndex].getText()]);
            myContext.setValSymbols2NewValC([((<ts.ParameterDeclaration>targetNode).name).getText()], valRefObj); //set Constructor local var
        } else if (parentNode.kind === ts.SyntaxKind.FunctionExpression && parentNode.parent.kind === ts.SyntaxKind.ArrayLiteralExpression
            && ((<ts.FunctionExpression>parentNode).parameters.length === ((<ts.ArrayLiteralExpression>(parentNode.parent)).elements.length - 1))) {// define parm to default gloval value
            for (var argIndex: number = 0; (<ts.FunctionExpression>parentNode).parameters[argIndex] !== targetNode; argIndex++) { ; }
            var valRefObj = myContext.getValSymbols2AnyValG([(<ts.ArrayLiteralExpression>(parentNode.parent)).elements[argIndex].getText()]);
            myContext.setValSymbols2NewValC([((<ts.ParameterDeclaration>targetNode).name).getText()], valRefObj); //set Constructor local var
        } else { // define parm to local name
            myContext.setValSymbols2NewValC([((<ts.ParameterDeclaration>targetNode).name).getText()], { __PickUp: false, __vague: false, __type: typeOfExpressionL, __value: "(/*Args:*/<" + typeOfExpressionL + ">" + ((<ts.ParameterDeclaration>targetNode).name).getText() + ")" } );
        }
        if (!(!((<ts.ParameterDeclaration>targetNode).initializer))) {
            myTsExprEval.setValExpr(<ts.Identifier>(<ts.ParameterDeclaration>targetNode).name, (<ts.ParameterDeclaration>targetNode).initializer);
        }
    };
    /**
     * "BinaryExpression","Assign","Compare","CompareR"の情報を抽出する
     */
    rem_BinaryExpression(targetNode: ts.BinaryExpression): void {
        var operatorTokenStr = targetNode.operatorToken.getText();
        var operatorType = (operatorTokenStr === "===" || operatorTokenStr === "==" ||
            operatorTokenStr === "!==" || operatorTokenStr === "!=" ||
            operatorTokenStr === "<=" || operatorTokenStr === "<" ||
            operatorTokenStr === ">=" || operatorTokenStr === ">") ? "Compare" :
            (ts.SyntaxKind.FirstAssignment <= targetNode.operatorToken.kind && targetNode.operatorToken.kind <= ts.SyntaxKind.LastAssignment) ? "Assign" :
                "BinaryExpression";
        var typeOfExpressionR = curTypeChecker.typeToString(curTypeChecker.getTypeAtLocation(targetNode.right));
        if (operatorType === "Assign") {
           myTsExprEval.updateValExpr(targetNode.left, operatorTokenStr, targetNode.right, typeOfExpressionR);
        }
    };
    // CallLikeExpression= CallExpression | NewExpression | TaggedTemplateExpression | Decorator
    rem_CallLikeExpression(targetNode: ts.LeftHandSideExpression, targetArgs: ts.NodeArray<ts.Expression>): void{
        if (!(!targetArgs) && targetArgs.length > 0){
            var targetMethodStr:string = targetNode.getText();
            var beCheck: Boolean = (this.callNames.indexOf(targetMethodStr) >= 0);
            if((! beCheck) && targetNode.kind === ts.SyntaxKind.PropertyAccessExpression){
                var  targetMethodStr:string = (<ts.PropertyAccessExpression>targetNode).name.getText();
                beCheck = (this.callNames.indexOf(targetMethodStr) >= 0);
                if (!beCheck) {
                    var  targetMethodStr:string = myTsExprEval.toSource(myTsExprEval.getObjectValF(targetNode));
                    beCheck = (this.callNames.indexOf(targetMethodStr) >= 0);
                }
            }
            if (beCheck) {
                for (var i = 0; i < targetArgs.length; i++) {
                    var rValObject: MyTsExprEvalType = myTsExprEval.getObjectVal(targetArgs[i]);
                    var rValStr: string = myTsExprEval.toSource(rValObject);
                    traceLogger.debug("!!## rem_CallLikeExpression :" + targetMethodStr + ".args[" + i + "]=" + rValStr);
                    var valueExpand = this.valueExpand;
                    if (rValStr.indexOf("/** !! undefined **/") > 0) { //Incomplete Object
                        this.curRuleWorker.addFailure(this.curRuleWorker.createFailure(targetArgs[i].getStart(), targetArgs[i].getWidth(), Rule.FAILURE_STRING1 + ":" + targetMethodStr + "(args[" + i + "])" + (valueExpand ? "\n" + rValStr + "\n;" : "")));
                        valueExpand = false;
                    }
                    if (this.checkVauge && rValStr.indexOf("|,|") > 0) { //曖昧な多値が含まれている
                        this.curRuleWorker.addFailure(this.curRuleWorker.createFailure(targetArgs[i].getStart(), targetArgs[i].getWidth(), Rule.FAILURE_STRING2 + ":" + targetMethodStr + "(args[" + i + "])" + (valueExpand ? "\n" + rValStr + "\n;" : "")));
                        valueExpand = false;
                    }                     
                }
            }
        }
    }
};
