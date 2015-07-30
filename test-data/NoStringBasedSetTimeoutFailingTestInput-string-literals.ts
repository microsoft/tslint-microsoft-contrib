
// these should all create violations
setTimeout("var x = 'should fail'");
this.setTimeout("var x = 'should fail'");
window.setTimeout("var x = 'should fail'");
