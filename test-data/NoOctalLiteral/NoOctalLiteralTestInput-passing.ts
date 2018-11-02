function demoScriptPass1() {
    var w1 = 'Sample text \xB2';
    var x1 = 'Sample text \0111'; // longer than octal
    var y1 = 'Sample text \\1';
    var z1 = 'Sample text \\\\1';

    var w2 = 'Sample text \xB2';
    var x2 = 'Sample text \0111'; // longer than octal
    var y2 = 'Sample text \\1';
    var z2 = 'Sample text \\\\1';

    var w3 = `Sample text \xB2`;
    var x3 = `Sample text \0111`; // longer than octal
    var y3 = `Sample text \\1`;
    var z3 = `Sample text \\\\1`;
}
