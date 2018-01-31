function demoScriptPass1() {
    var x1 = "Sample text \xB2";
    var y1 = "Sample text \0111"; // longer than octal
    var z1 = "Sample text \\1";
    var z1 = "Sample text \\\\1";

    var x2 = 'Sample text \xB2';
    var y2 = 'Sample text \0111'; // longer than octal
    var z2 = 'Sample text \\1';
    var z2 = 'Sample text \\\\1';

    var x3 = `Sample text \xB2`;
    var y3 = `Sample text \0111`; // longer than octal
    var z3 = `Sample text \\1`;
    var z3 = `Sample text \\\\1`;
};
