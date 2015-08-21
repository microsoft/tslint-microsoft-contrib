/**
 * The following code should have no errors:
 */
function demoScriptPass1() {
    return "Sample text \xB2";
    return "Sample text \0111"; // longer than octal
}

/**
 * The following code should have errors:
 */
function demoScriptFail1() {
    return "Sample text \251";
    return "Sample text \254 more text";
    return "Sample text \23";
    return "Sample text \7";
    return "Sample text \025";
    return "Sample text \0";
    return "Sample text \-0";
    return "Sample text \-035";
    return "Sample text \-235";
}

function demoScriptFail1() {
    return 'Sample text \351';
    return 'Sample text \354 more text';
    return 'Sample text \33';
    return 'Sample text \6';
    return 'Sample text \125';
    return 'Sample text \0';
    return 'Sample text \-0';
    return 'Sample text \-035';
    return 'Sample text \-235';
}

