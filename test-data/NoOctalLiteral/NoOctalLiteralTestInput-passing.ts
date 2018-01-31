function demoScriptPass1() {
    var x = "Sample text \xB2";
    var y = "Sample text \0111"; // longer than octal
    var z = "Sample text \\1";
    var z = "Sample text \\\\1";
};
