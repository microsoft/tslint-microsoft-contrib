import * as ts from 'typescript';
/**
 * This module provides backwards compatibility for TypeScript's ts.SyntaxKind interface.
 * The numbers assigned to the enum elements change with each TypeScript release, so if
 * we want to run these rules against multiple versions of TypeScript then we need to query
 * the TypeScript version at runtime and return the correct numbers for the SyntaxKind
 * elements.
 */
module SyntaxKind {

    export interface SyntaxKind {
        Unknown: number;
        EndOfFileToken: number;
        SingleLineCommentTrivia: number;
        MultiLineCommentTrivia: number;
        NewLineTrivia: number;
        WhitespaceTrivia: number;
        ShebangTrivia?: number; //1.6 only
        ConflictMarkerTrivia: number;
        NumericLiteral: number;
        StringLiteral: number;
        RegularExpressionLiteral: number;
        NoSubstitutionTemplateLiteral: number;
        TemplateHead: number;
        TemplateMiddle: number;
        TemplateTail: number;
        OpenBraceToken: number;
        CloseBraceToken: number;
        OpenParenToken: number;
        CloseParenToken: number;
        OpenBracketToken: number;
        CloseBracketToken: number;
        DotToken: number;
        DotDotDotToken: number;
        SemicolonToken: number;
        CommaToken: number;
        LessThanToken: number;
        LessThanSlashToken?: number; //1.6 only
        GreaterThanToken: number;
        LessThanEqualsToken: number;
        GreaterThanEqualsToken: number;
        EqualsEqualsToken: number;
        ExclamationEqualsToken: number;
        EqualsEqualsEqualsToken: number;
        ExclamationEqualsEqualsToken: number;
        EqualsGreaterThanToken: number;
        PlusToken: number;
        MinusToken: number;
        AsteriskToken: number;
        SlashToken: number;
        PercentToken: number;
        PlusPlusToken: number;
        MinusMinusToken: number;
        LessThanLessThanToken: number;
        GreaterThanGreaterThanToken: number;
        GreaterThanGreaterThanGreaterThanToken: number;
        AmpersandToken: number;
        BarToken: number;
        CaretToken: number;
        ExclamationToken: number;
        TildeToken: number;
        AmpersandAmpersandToken: number;
        BarBarToken: number;
        QuestionToken: number;
        ColonToken: number;
        AtToken: number;
        EqualsToken: number;
        PlusEqualsToken: number;
        MinusEqualsToken: number;
        AsteriskEqualsToken: number;
        SlashEqualsToken: number;
        PercentEqualsToken: number;
        LessThanLessThanEqualsToken: number;
        GreaterThanGreaterThanEqualsToken: number;
        GreaterThanGreaterThanGreaterThanEqualsToken: number;
        AmpersandEqualsToken: number;
        BarEqualsToken: number;
        CaretEqualsToken: number;
        Identifier: number;
        BreakKeyword: number;
        CaseKeyword: number;
        CatchKeyword: number;
        ClassKeyword: number;
        ConstKeyword: number;
        ContinueKeyword: number;
        DebuggerKeyword: number;
        DefaultKeyword: number;
        DeleteKeyword: number;
        DoKeyword: number;
        ElseKeyword: number;
        EnumKeyword: number;
        ExportKeyword: number;
        ExtendsKeyword: number;
        FalseKeyword: number;
        FinallyKeyword: number;
        ForKeyword: number;
        FunctionKeyword: number;
        IfKeyword: number;
        ImportKeyword: number;
        InKeyword: number;
        InstanceOfKeyword: number;
        NewKeyword: number;
        NullKeyword: number;
        ReturnKeyword: number;
        SuperKeyword: number;
        SwitchKeyword: number;
        ThisKeyword: number;
        ThrowKeyword: number;
        TrueKeyword: number;
        TryKeyword: number;
        TypeOfKeyword: number;
        VarKeyword: number;
        VoidKeyword: number;
        WhileKeyword: number;
        WithKeyword: number;
        ImplementsKeyword: number;
        InterfaceKeyword: number;
        LetKeyword: number;
        PackageKeyword: number;
        PrivateKeyword: number;
        ProtectedKeyword: number;
        PublicKeyword: number;
        StaticKeyword: number;
        YieldKeyword: number;
        AbstractKeyword?: number; //1.6 only
        AsKeyword: number;
        AnyKeyword: number;
        AsyncKeyword?: number; //1.6 only
        AwaitKeyword?: number; //1.6 only
        BooleanKeyword: number;
        ConstructorKeyword: number;
        DeclareKeyword: number;
        GetKeyword: number;
        IsKeyword?: number; //1.6 only
        ModuleKeyword: number;
        NamespaceKeyword: number;
        RequireKeyword: number;
        NumberKeyword: number;
        SetKeyword: number;
        StringKeyword: number;
        SymbolKeyword: number;
        TypeKeyword: number;
        FromKeyword: number;
        OfKeyword: number;
        QualifiedName: number;
        ComputedPropertyName: number;
        TypeParameter: number;
        Parameter: number;
        Decorator: number;
        PropertySignature: number;
        PropertyDeclaration: number;
        MethodSignature: number;
        MethodDeclaration: number;
        Constructor: number;
        GetAccessor: number;
        SetAccessor: number;
        CallSignature: number;
        ConstructSignature: number;
        IndexSignature: number;
        TypePredicate?: number; //1.6 only
        TypeReference: number;
        FunctionType: number;
        ConstructorType: number;
        TypeQuery: number;
        TypeLiteral: number;
        ArrayType: number;
        TupleType: number;
        UnionType: number;
        IntersectionType?: number; //1.6 only
        ParenthesizedType: number;
        ObjectBindingPattern: number;
        ArrayBindingPattern: number;
        BindingElement: number;
        ArrayLiteralExpression: number;
        ObjectLiteralExpression: number;
        PropertyAccessExpression: number;
        ElementAccessExpression: number;
        CallExpression: number;
        NewExpression: number;
        TaggedTemplateExpression: number;
        TypeAssertionExpression: number;
        ParenthesizedExpression: number;
        FunctionExpression: number;
        ArrowFunction: number;
        DeleteExpression: number;
        TypeOfExpression: number;
        VoidExpression: number;
        AwaitExpression?: number; //1.6 only
        PrefixUnaryExpression: number;
        PostfixUnaryExpression: number;
        BinaryExpression: number;
        ConditionalExpression: number;
        TemplateExpression: number;
        YieldExpression: number;
        SpreadElementExpression: number;
        ClassExpression: number;
        OmittedExpression: number;
        ExpressionWithTypeArguments: number;
        AsExpression?: number; //1.6 only
        TemplateSpan: number;
        SemicolonClassElement: number;
        Block: number;
        VariableStatement: number;
        EmptyStatement: number;
        ExpressionStatement: number;
        IfStatement: number;
        DoStatement: number;
        WhileStatement: number;
        ForStatement: number;
        ForInStatement: number;
        ForOfStatement: number;
        ContinueStatement: number;
        BreakStatement: number;
        ReturnStatement: number;
        WithStatement: number;
        SwitchStatement: number;
        LabeledStatement: number;
        ThrowStatement: number;
        TryStatement: number;
        DebuggerStatement: number;
        VariableDeclaration: number;
        VariableDeclarationList: number;
        FunctionDeclaration: number;
        ClassDeclaration: number;
        InterfaceDeclaration: number;
        TypeAliasDeclaration: number;
        EnumDeclaration: number;
        ModuleDeclaration: number;
        ModuleBlock: number;
        CaseBlock: number;
        ImportEqualsDeclaration: number;
        ImportDeclaration: number;
        ImportClause: number;
        NamespaceImport: number;
        NamedImports: number;
        ImportSpecifier: number;
        ExportAssignment: number;
        ExportDeclaration: number;
        NamedExports: number;
        ExportSpecifier: number;
        MissingDeclaration: number;
        ExternalModuleReference: number;
        JsxElement?: number; //1.6 only
        JsxSelfClosingElement?: number; //1.6 only
        JsxOpeningElement?: number; //1.6 only
        JsxText?: number; //1.6 only
        JsxClosingElement?: number; //1.6 only
        JsxAttribute?: number; //1.6 only
        JsxSpreadAttribute?: number; //1.6 only
        JsxExpression?: number; //1.6 only
        CaseClause: number;
        DefaultClause: number;
        HeritageClause: number;
        CatchClause: number;
        PropertyAssignment: number;
        ShorthandPropertyAssignment: number;
        EnumMember: number;
        SourceFile: number;
        JSDocTypeExpression?: number; //1.6 only
        JSDocAllType?: number; //1.6 only
        JSDocUnknownType?: number; //1.6 only
        JSDocArrayType?: number; //1.6 only
        JSDocUnionType?: number; //1.6 only
        JSDocTupleType?: number; //1.6 only
        JSDocNullableType?: number; //1.6 only
        JSDocNonNullableType?: number; //1.6 only
        JSDocRecordType?: number; //1.6 only
        JSDocRecordMember?: number; //1.6 only
        JSDocTypeReference?: number; //1.6 only
        JSDocOptionalType?: number; //1.6 only
        JSDocFunctionType?: number; //1.6 only
        JSDocVariadicType?: number; //1.6 only
        JSDocConstructorType?: number; //1.6 only
        JSDocThisType?: number; //1.6 only
        JSDocComment?: number; //1.6 only
        JSDocTag?: number; //1.6 only
        JSDocParameterTag?: number; //1.6 only
        JSDocReturnTag?: number; //1.6 only
        JSDocTypeTag?: number; //1.6 only
        JSDocTemplateTag?: number; //1.6 only
        SyntaxList: number;
        Count: number;
        FirstAssignment: number;
        LastAssignment: number;
        FirstReservedWord: number;
        LastReservedWord: number;
        FirstKeyword: number;
        LastKeyword: number;
        FirstFutureReservedWord: number;
        LastFutureReservedWord: number;
        FirstTypeNode: number;
        LastTypeNode: number;
        FirstPunctuation: number;
        LastPunctuation: number;
        FirstToken: number;
        LastToken: number;
        FirstTriviaToken: number;
        LastTriviaToken: number;
        FirstLiteralToken: number;
        LastLiteralToken: number;
        FirstTemplateToken: number;
        LastTemplateToken: number;
        FirstBinaryOperator: number;
        LastBinaryOperator: number;
        FirstNode: number;
        AsteriskAsteriskToken?: number; // 1.7 only
        AsteriskAsteriskEqualsToken?: number; // 1.7 only
    }

    var cachedKinds: SyntaxKind.SyntaxKind;

    /* tslint:disable:variable-name */
    
    export function current(): SyntaxKind.SyntaxKind {
        if (cachedKinds == null) {
            
     export function current(): SyntaxKind.SyntaxKind {
        if (cachedKinds == null) {
        /* tslint:enable:variable-name */
        cachedKinds = <SyntaxKind.SyntaxKind> {
        Unknown: (<any>ts).SyntaxKind["Unknown"],
        EndOfFileToken: (<any>ts).SyntaxKind["EndOfFileToken"],
        SingleLineCommentTrivia: (<any>ts).SyntaxKind["SingleLineCommentTrivia"],
        MultiLineCommentTrivia: (<any>ts).SyntaxKind["MultiLineCommentTrivia"],
        NewLineTrivia: (<any>ts).SyntaxKind["NewLineTrivia"],
        WhitespaceTrivia: (<any>ts).SyntaxKind["WhitespaceTrivia"],
        ShebangTrivia: (<any>ts).SyntaxKind["ShebangTrivia"],
        ConflictMarkerTrivia: (<any>ts).SyntaxKind["ConflictMarkerTrivia"],
        NumericLiteral: (<any>ts).SyntaxKind["NumericLiteral"],
        StringLiteral: (<any>ts).SyntaxKind["StringLiteral"],
        RegularExpressionLiteral: (<any>ts).SyntaxKind["RegularExpressionLiteral"],
        NoSubstitutionTemplateLiteral: (<any>ts).SyntaxKind["NoSubstitutionTemplateLiteral"],
        TemplateHead: (<any>ts).SyntaxKind["TemplateHead"],
        TemplateMiddle: (<any>ts).SyntaxKind["TemplateMiddle"],
        TemplateTail: (<any>ts).SyntaxKind["TemplateTail"],
        OpenBraceToken: (<any>ts).SyntaxKind["OpenBraceToken"],
        CloseBraceToken: (<any>ts).SyntaxKind["CloseBraceToken"],
        OpenParenToken: (<any>ts).SyntaxKind["OpenParenToken"],
        CloseParenToken: (<any>ts).SyntaxKind["CloseParenToken"],
        OpenBracketToken: (<any>ts).SyntaxKind["OpenBracketToken"],
        CloseBracketToken: (<any>ts).SyntaxKind["CloseBracketToken"],
        DotToken: (<any>ts).SyntaxKind["DotToken"],
        DotDotDotToken: (<any>ts).SyntaxKind["DotDotDotToken"],
        SemicolonToken: (<any>ts).SyntaxKind["SemicolonToken"],
        CommaToken: (<any>ts).SyntaxKind["CommaToken"],
        LessThanToken: (<any>ts).SyntaxKind["LessThanToken"],
        LessThanSlashToken: (<any>ts).SyntaxKind["LessThanSlashToken"],
        GreaterThanToken: (<any>ts).SyntaxKind["GreaterThanToken"],
        LessThanEqualsToken: (<any>ts).SyntaxKind["LessThanEqualsToken"],
        GreaterThanEqualsToken: (<any>ts).SyntaxKind["GreaterThanEqualsToken"],
        EqualsEqualsToken: (<any>ts).SyntaxKind["EqualsEqualsToken"],
        ExclamationEqualsToken: (<any>ts).SyntaxKind["ExclamationEqualsToken"],
        EqualsEqualsEqualsToken: (<any>ts).SyntaxKind["EqualsEqualsEqualsToken"],
        ExclamationEqualsEqualsToken: (<any>ts).SyntaxKind["ExclamationEqualsEqualsToken"],
        EqualsGreaterThanToken: (<any>ts).SyntaxKind["EqualsGreaterThanToken"],
        PlusToken: (<any>ts).SyntaxKind["PlusToken"],
        MinusToken: (<any>ts).SyntaxKind["MinusToken"],
        AsteriskToken: (<any>ts).SyntaxKind["AsteriskToken"],
        //AsteriskAsteriskToken: (<any>ts).SyntaxKind["AsteriskAsteriskToken"], v1.7 only
        SlashToken: (<any>ts).SyntaxKind["SlashToken"],
        PercentToken: (<any>ts).SyntaxKind["PercentToken"],
        PlusPlusToken: (<any>ts).SyntaxKind["PlusPlusToken"],
        MinusMinusToken: (<any>ts).SyntaxKind["MinusMinusToken"],
        LessThanLessThanToken: (<any>ts).SyntaxKind["LessThanLessThanToken"],
        GreaterThanGreaterThanToken: (<any>ts).SyntaxKind["GreaterThanGreaterThanToken"],
        GreaterThanGreaterThanGreaterThanToken: (<any>ts).SyntaxKind["GreaterThanGreaterThanGreaterThanToken"],
        AmpersandToken: (<any>ts).SyntaxKind["AmpersandToken"],
        BarToken: (<any>ts).SyntaxKind["BarToken"],
        CaretToken: (<any>ts).SyntaxKind["CaretToken"],
        ExclamationToken: (<any>ts).SyntaxKind["ExclamationToken"],
        TildeToken: (<any>ts).SyntaxKind["TildeToken"],
        AmpersandAmpersandToken: (<any>ts).SyntaxKind["AmpersandAmpersandToken"],
        BarBarToken: (<any>ts).SyntaxKind["BarBarToken"],
        QuestionToken: (<any>ts).SyntaxKind["QuestionToken"],
        ColonToken: (<any>ts).SyntaxKind["ColonToken"],
        AtToken: (<any>ts).SyntaxKind["AtToken"],
        EqualsToken: (<any>ts).SyntaxKind["EqualsToken"],
        PlusEqualsToken: (<any>ts).SyntaxKind["PlusEqualsToken"],
        MinusEqualsToken: (<any>ts).SyntaxKind["MinusEqualsToken"],
        AsteriskEqualsToken: (<any>ts).SyntaxKind["AsteriskEqualsToken"],
       // AsteriskAsteriskEqualsToken: (<any>ts).SyntaxKind["AsteriskAsteriskEqualsToken"], v1.7 only 
        SlashEqualsToken: (<any>ts).SyntaxKind["SlashEqualsToken"],
        PercentEqualsToken: (<any>ts).SyntaxKind["PercentEqualsToken"],
        LessThanLessThanEqualsToken: (<any>ts).SyntaxKind["LessThanLessThanEqualsToken"],
        GreaterThanGreaterThanEqualsToken: (<any>ts).SyntaxKind["GreaterThanGreaterThanEqualsToken"],
        GreaterThanGreaterThanGreaterThanEqualsToken: (<any>ts).SyntaxKind["GreaterThanGreaterThanGreaterThanEqualsToken"],
        AmpersandEqualsToken: (<any>ts).SyntaxKind["AmpersandEqualsToken"],
        BarEqualsToken: (<any>ts).SyntaxKind["BarEqualsToken"],
        CaretEqualsToken: (<any>ts).SyntaxKind["CaretEqualsToken"],
        Identifier: (<any>ts).SyntaxKind["Identifier"],
        BreakKeyword: (<any>ts).SyntaxKind["BreakKeyword"],
        CaseKeyword: (<any>ts).SyntaxKind["CaseKeyword"],
        CatchKeyword: (<any>ts).SyntaxKind["CatchKeyword"],
        ClassKeyword: (<any>ts).SyntaxKind["ClassKeyword"],
        ConstKeyword: (<any>ts).SyntaxKind["ConstKeyword"],
        ContinueKeyword: (<any>ts).SyntaxKind["ContinueKeyword"],
        DebuggerKeyword: (<any>ts).SyntaxKind["DebuggerKeyword"],
        DefaultKeyword: (<any>ts).SyntaxKind["DefaultKeyword"],
        DeleteKeyword: (<any>ts).SyntaxKind["DeleteKeyword"],
        DoKeyword: (<any>ts).SyntaxKind["DoKeyword"],
        ElseKeyword: (<any>ts).SyntaxKind["ElseKeyword"],
        EnumKeyword: (<any>ts).SyntaxKind["EnumKeyword"],
        ExportKeyword: (<any>ts).SyntaxKind["ExportKeyword"],
        ExtendsKeyword: (<any>ts).SyntaxKind["ExtendsKeyword"],
        FalseKeyword: (<any>ts).SyntaxKind["FalseKeyword"],
        FinallyKeyword: (<any>ts).SyntaxKind["FinallyKeyword"],
        ForKeyword: (<any>ts).SyntaxKind["ForKeyword"],
        FunctionKeyword: (<any>ts).SyntaxKind["FunctionKeyword"],
        IfKeyword: (<any>ts).SyntaxKind["IfKeyword"],
        ImportKeyword: (<any>ts).SyntaxKind["ImportKeyword"],
        InKeyword: (<any>ts).SyntaxKind["InKeyword"],
        InstanceOfKeyword: (<any>ts).SyntaxKind["InstanceOfKeyword"],
        NewKeyword: (<any>ts).SyntaxKind["NewKeyword"],
        NullKeyword: (<any>ts).SyntaxKind["NullKeyword"],
        ReturnKeyword: (<any>ts).SyntaxKind["ReturnKeyword"],
        SuperKeyword: (<any>ts).SyntaxKind["SuperKeyword"],
        SwitchKeyword: (<any>ts).SyntaxKind["SwitchKeyword"],
        ThisKeyword: (<any>ts).SyntaxKind["ThisKeyword"],
        ThrowKeyword: (<any>ts).SyntaxKind["ThrowKeyword"],
        TrueKeyword: (<any>ts).SyntaxKind["TrueKeyword"],
        TryKeyword: (<any>ts).SyntaxKind["TryKeyword"],
        TypeOfKeyword: (<any>ts).SyntaxKind["TypeOfKeyword"],
        VarKeyword: (<any>ts).SyntaxKind["VarKeyword"],
        VoidKeyword: (<any>ts).SyntaxKind["VoidKeyword"],
        WhileKeyword: (<any>ts).SyntaxKind["WhileKeyword"],
        WithKeyword: (<any>ts).SyntaxKind["WithKeyword"],
        ImplementsKeyword: (<any>ts).SyntaxKind["ImplementsKeyword"],
        InterfaceKeyword: (<any>ts).SyntaxKind["InterfaceKeyword"],
        LetKeyword: (<any>ts).SyntaxKind["LetKeyword"],
        PackageKeyword: (<any>ts).SyntaxKind["PackageKeyword"],
        PrivateKeyword: (<any>ts).SyntaxKind["PrivateKeyword"],
        ProtectedKeyword: (<any>ts).SyntaxKind["ProtectedKeyword"],
        PublicKeyword: (<any>ts).SyntaxKind["PublicKeyword"],
        StaticKeyword: (<any>ts).SyntaxKind["StaticKeyword"],
        YieldKeyword: (<any>ts).SyntaxKind["YieldKeyword"],
        AbstractKeyword: (<any>ts).SyntaxKind["AbstractKeyword"],
        AsKeyword: (<any>ts).SyntaxKind["AsKeyword"],
        AnyKeyword: (<any>ts).SyntaxKind["AnyKeyword"],
        AsyncKeyword: (<any>ts).SyntaxKind["AsyncKeyword"],
        AwaitKeyword: (<any>ts).SyntaxKind["AwaitKeyword"],
        BooleanKeyword: (<any>ts).SyntaxKind["BooleanKeyword"],
        ConstructorKeyword: (<any>ts).SyntaxKind["ConstructorKeyword"],
        DeclareKeyword: (<any>ts).SyntaxKind["DeclareKeyword"],
        GetKeyword: (<any>ts).SyntaxKind["GetKeyword"],
        IsKeyword: (<any>ts).SyntaxKind["IsKeyword"],
        ModuleKeyword: (<any>ts).SyntaxKind["ModuleKeyword"],
        NamespaceKeyword: (<any>ts).SyntaxKind["NamespaceKeyword"],
        RequireKeyword: (<any>ts).SyntaxKind["RequireKeyword"],
        NumberKeyword: (<any>ts).SyntaxKind["NumberKeyword"],
        SetKeyword: (<any>ts).SyntaxKind["SetKeyword"],
        StringKeyword: (<any>ts).SyntaxKind["StringKeyword"],
        SymbolKeyword: (<any>ts).SyntaxKind["SymbolKeyword"],
        TypeKeyword: (<any>ts).SyntaxKind["TypeKeyword"],
        FromKeyword: (<any>ts).SyntaxKind["FromKeyword"],
        OfKeyword: (<any>ts).SyntaxKind["OfKeyword"],
        QualifiedName: (<any>ts).SyntaxKind["QualifiedName"],
        ComputedPropertyName: (<any>ts).SyntaxKind["ComputedPropertyName"],
        TypeParameter: (<any>ts).SyntaxKind["TypeParameter"],
        Parameter: (<any>ts).SyntaxKind["Parameter"],
        Decorator: (<any>ts).SyntaxKind["Decorator"],
        PropertySignature: (<any>ts).SyntaxKind["PropertySignature"],
        PropertyDeclaration: (<any>ts).SyntaxKind["PropertyDeclaration"],
        MethodSignature: (<any>ts).SyntaxKind["MethodSignature"],
        MethodDeclaration: (<any>ts).SyntaxKind["MethodDeclaration"],
        Constructor: (<any>ts).SyntaxKind["Constructor"],
        GetAccessor: (<any>ts).SyntaxKind["GetAccessor"],
        SetAccessor: (<any>ts).SyntaxKind["SetAccessor"],
        CallSignature: (<any>ts).SyntaxKind["CallSignature"],
        ConstructSignature: (<any>ts).SyntaxKind["ConstructSignature"],
        IndexSignature: (<any>ts).SyntaxKind["IndexSignature"],
        TypePredicate: (<any>ts).SyntaxKind["TypePredicate"],
        TypeReference: (<any>ts).SyntaxKind["TypeReference"],
        FunctionType: (<any>ts).SyntaxKind["FunctionType"],
        ConstructorType: (<any>ts).SyntaxKind["ConstructorType"],
        TypeQuery: (<any>ts).SyntaxKind["TypeQuery"],
        TypeLiteral: (<any>ts).SyntaxKind["TypeLiteral"],
        ArrayType: (<any>ts).SyntaxKind["ArrayType"],
        TupleType: (<any>ts).SyntaxKind["TupleType"],
        UnionType: (<any>ts).SyntaxKind["UnionType"],
        IntersectionType: (<any>ts).SyntaxKind["IntersectionType"],
        ParenthesizedType: (<any>ts).SyntaxKind["ParenthesizedType"],
        ObjectBindingPattern: (<any>ts).SyntaxKind["ObjectBindingPattern"],
        ArrayBindingPattern: (<any>ts).SyntaxKind["ArrayBindingPattern"],
        BindingElement: (<any>ts).SyntaxKind["BindingElement"],
        ArrayLiteralExpression: (<any>ts).SyntaxKind["ArrayLiteralExpression"],
        ObjectLiteralExpression: (<any>ts).SyntaxKind["ObjectLiteralExpression"],
        PropertyAccessExpression: (<any>ts).SyntaxKind["PropertyAccessExpression"],
        ElementAccessExpression: (<any>ts).SyntaxKind["ElementAccessExpression"],
        CallExpression: (<any>ts).SyntaxKind["CallExpression"],
        NewExpression: (<any>ts).SyntaxKind["NewExpression"],
        TaggedTemplateExpression: (<any>ts).SyntaxKind["TaggedTemplateExpression"],
        TypeAssertionExpression: (<any>ts).SyntaxKind["TypeAssertionExpression"],
        ParenthesizedExpression: (<any>ts).SyntaxKind["ParenthesizedExpression"],
        FunctionExpression: (<any>ts).SyntaxKind["FunctionExpression"],
        ArrowFunction: (<any>ts).SyntaxKind["ArrowFunction"],
        DeleteExpression: (<any>ts).SyntaxKind["DeleteExpression"],
        TypeOfExpression: (<any>ts).SyntaxKind["TypeOfExpression"],
        VoidExpression: (<any>ts).SyntaxKind["VoidExpression"],
        AwaitExpression: (<any>ts).SyntaxKind["AwaitExpression"],
        PrefixUnaryExpression: (<any>ts).SyntaxKind["PrefixUnaryExpression"],
        PostfixUnaryExpression: (<any>ts).SyntaxKind["PostfixUnaryExpression"],
        BinaryExpression: (<any>ts).SyntaxKind["BinaryExpression"],
        ConditionalExpression: (<any>ts).SyntaxKind["ConditionalExpression"],
        TemplateExpression: (<any>ts).SyntaxKind["TemplateExpression"],
        YieldExpression: (<any>ts).SyntaxKind["YieldExpression"],
        SpreadElementExpression: (<any>ts).SyntaxKind["SpreadElementExpression"],
        ClassExpression: (<any>ts).SyntaxKind["ClassExpression"],
        OmittedExpression: (<any>ts).SyntaxKind["OmittedExpression"],
        ExpressionWithTypeArguments: (<any>ts).SyntaxKind["ExpressionWithTypeArguments"],
        AsExpression: (<any>ts).SyntaxKind["AsExpression"],
        TemplateSpan: (<any>ts).SyntaxKind["TemplateSpan"],
        SemicolonClassElement: (<any>ts).SyntaxKind["SemicolonClassElement"],
        Block: (<any>ts).SyntaxKind["Block"],
        VariableStatement: (<any>ts).SyntaxKind["VariableStatement"],
        EmptyStatement: (<any>ts).SyntaxKind["EmptyStatement"],
        ExpressionStatement: (<any>ts).SyntaxKind["ExpressionStatement"],
        IfStatement: (<any>ts).SyntaxKind["IfStatement"],
        DoStatement: (<any>ts).SyntaxKind["DoStatement"],
        WhileStatement: (<any>ts).SyntaxKind["WhileStatement"],
        ForStatement: (<any>ts).SyntaxKind["ForStatement"],
        ForInStatement: (<any>ts).SyntaxKind["ForInStatement"],
        ForOfStatement: (<any>ts).SyntaxKind["ForOfStatement"],
        ContinueStatement: (<any>ts).SyntaxKind["ContinueStatement"],
        BreakStatement: (<any>ts).SyntaxKind["BreakStatement"],
        ReturnStatement: (<any>ts).SyntaxKind["ReturnStatement"],
        WithStatement: (<any>ts).SyntaxKind["WithStatement"],
        SwitchStatement: (<any>ts).SyntaxKind["SwitchStatement"],
        LabeledStatement: (<any>ts).SyntaxKind["LabeledStatement"],
        ThrowStatement: (<any>ts).SyntaxKind["ThrowStatement"],
        TryStatement: (<any>ts).SyntaxKind["TryStatement"],
        DebuggerStatement: (<any>ts).SyntaxKind["DebuggerStatement"],
        VariableDeclaration: (<any>ts).SyntaxKind["VariableDeclaration"],
        VariableDeclarationList: (<any>ts).SyntaxKind["VariableDeclarationList"],
        FunctionDeclaration: (<any>ts).SyntaxKind["FunctionDeclaration"],
        ClassDeclaration: (<any>ts).SyntaxKind["ClassDeclaration"],
        InterfaceDeclaration: (<any>ts).SyntaxKind["InterfaceDeclaration"],
        TypeAliasDeclaration: (<any>ts).SyntaxKind["TypeAliasDeclaration"],
        EnumDeclaration: (<any>ts).SyntaxKind["EnumDeclaration"],
        ModuleDeclaration: (<any>ts).SyntaxKind["ModuleDeclaration"],
        ModuleBlock: (<any>ts).SyntaxKind["ModuleBlock"],
        CaseBlock: (<any>ts).SyntaxKind["CaseBlock"],
        ImportEqualsDeclaration: (<any>ts).SyntaxKind["ImportEqualsDeclaration"],
        ImportDeclaration: (<any>ts).SyntaxKind["ImportDeclaration"],
        ImportClause: (<any>ts).SyntaxKind["ImportClause"],
        NamespaceImport: (<any>ts).SyntaxKind["NamespaceImport"],
        NamedImports: (<any>ts).SyntaxKind["NamedImports"],
        ImportSpecifier: (<any>ts).SyntaxKind["ImportSpecifier"],
        ExportAssignment: (<any>ts).SyntaxKind["ExportAssignment"],
        ExportDeclaration: (<any>ts).SyntaxKind["ExportDeclaration"],
        NamedExports: (<any>ts).SyntaxKind["NamedExports"],
        ExportSpecifier: (<any>ts).SyntaxKind["ExportSpecifier"],
        MissingDeclaration: (<any>ts).SyntaxKind["MissingDeclaration"],
        ExternalModuleReference: (<any>ts).SyntaxKind["ExternalModuleReference"],
        JsxElement: (<any>ts).SyntaxKind["JsxElement"],
        JsxSelfClosingElement: (<any>ts).SyntaxKind["JsxSelfClosingElement"],
        JsxOpeningElement: (<any>ts).SyntaxKind["JsxOpeningElement"],
        JsxText: (<any>ts).SyntaxKind["JsxText"],
        JsxClosingElement: (<any>ts).SyntaxKind["JsxClosingElement"],
        JsxAttribute: (<any>ts).SyntaxKind["JsxAttribute"],
        JsxSpreadAttribute: (<any>ts).SyntaxKind["JsxSpreadAttribute"],
        JsxExpression: (<any>ts).SyntaxKind["JsxExpression"],
        CaseClause: (<any>ts).SyntaxKind["CaseClause"],
        DefaultClause: (<any>ts).SyntaxKind["DefaultClause"],
        HeritageClause: (<any>ts).SyntaxKind["HeritageClause"],
        CatchClause: (<any>ts).SyntaxKind["CatchClause"],
        PropertyAssignment: (<any>ts).SyntaxKind["PropertyAssignment"],
        ShorthandPropertyAssignment: (<any>ts).SyntaxKind["ShorthandPropertyAssignment"],
        EnumMember: (<any>ts).SyntaxKind["EnumMember"],
        SourceFile: (<any>ts).SyntaxKind["SourceFile"],
        JSDocTypeExpression: (<any>ts).SyntaxKind["JSDocTypeExpression"],
        JSDocAllType: (<any>ts).SyntaxKind["JSDocAllType"],
        JSDocUnknownType: (<any>ts).SyntaxKind["JSDocUnknownType"],
        JSDocArrayType: (<any>ts).SyntaxKind["JSDocArrayType"],
        JSDocUnionType: (<any>ts).SyntaxKind["JSDocUnionType"],
        JSDocTupleType: (<any>ts).SyntaxKind["JSDocTupleType"],
        JSDocNullableType: (<any>ts).SyntaxKind["JSDocNullableType"],
        JSDocNonNullableType: (<any>ts).SyntaxKind["JSDocNonNullableType"],
        JSDocRecordType: (<any>ts).SyntaxKind["JSDocRecordType"],
        JSDocRecordMember: (<any>ts).SyntaxKind["JSDocRecordMember"],
        JSDocTypeReference: (<any>ts).SyntaxKind["JSDocTypeReference"],
        JSDocOptionalType: (<any>ts).SyntaxKind["JSDocOptionalType"],
        JSDocFunctionType: (<any>ts).SyntaxKind["JSDocFunctionType"],
        JSDocVariadicType: (<any>ts).SyntaxKind["JSDocVariadicType"],
        JSDocConstructorType: (<any>ts).SyntaxKind["JSDocConstructorType"],
        JSDocThisType: (<any>ts).SyntaxKind["JSDocThisType"],
        JSDocComment: (<any>ts).SyntaxKind["JSDocComment"],
        JSDocTag: (<any>ts).SyntaxKind["JSDocTag"],
        JSDocParameterTag: (<any>ts).SyntaxKind["JSDocParameterTag"],
        JSDocReturnTag: (<any>ts).SyntaxKind["JSDocReturnTag"],
        JSDocTypeTag: (<any>ts).SyntaxKind["JSDocTypeTag"],
        JSDocTemplateTag: (<any>ts).SyntaxKind["JSDocTemplateTag"],
        SyntaxList: (<any>ts).SyntaxKind["SyntaxList"],
        Count: (<any>ts).SyntaxKind["Count"],
        FirstAssignment: (<any>ts).SyntaxKind["FirstAssignment"],
        LastAssignment: (<any>ts).SyntaxKind["LastAssignment"],
        FirstReservedWord: (<any>ts).SyntaxKind["FirstReservedWord"],
        LastReservedWord: (<any>ts).SyntaxKind["LastReservedWord"],
        FirstKeyword: (<any>ts).SyntaxKind["FirstKeyword"],
        LastKeyword: (<any>ts).SyntaxKind["LastKeyword"],
        FirstFutureReservedWord: (<any>ts).SyntaxKind["FirstFutureReservedWord"],
        LastFutureReservedWord: (<any>ts).SyntaxKind["LastFutureReservedWord"],
        FirstTypeNode: (<any>ts).SyntaxKind["FirstTypeNode"],
        LastTypeNode: (<any>ts).SyntaxKind["LastTypeNode"],
        FirstPunctuation: (<any>ts).SyntaxKind["FirstPunctuation"],
        LastPunctuation: (<any>ts).SyntaxKind["LastPunctuation"],
        FirstToken: (<any>ts).SyntaxKind["FirstToken"],
        LastToken: (<any>ts).SyntaxKind["LastToken"],
        FirstTriviaToken: (<any>ts).SyntaxKind["FirstTriviaToken"],
        LastTriviaToken: (<any>ts).SyntaxKind["LastTriviaToken"],
        FirstLiteralToken: (<any>ts).SyntaxKind["FirstLiteralToken"],
        LastLiteralToken: (<any>ts).SyntaxKind["LastLiteralToken"],
        FirstTemplateToken: (<any>ts).SyntaxKind["FirstTemplateToken"],
        LastTemplateToken: (<any>ts).SyntaxKind["LastTemplateToken"],
        FirstBinaryOperator: (<any>ts).SyntaxKind["FirstBinaryOperator"],
        LastBinaryOperator: (<any>ts).SyntaxKind["LastBinaryOperator"],
        FirstNode: (<any>ts).SyntaxKind["FirstNode"]};

		    if (cachedKinds.Count !== (<any>ts).SyntaxKind["Count"]) {
			    throw new Error('Unsupported TypeScript version: ' + ts.version);
            }
        }
        return cachedKinds;
    }
}

export = SyntaxKind;

