
execScript('alert("hello world")');
this.execScript('alert("hello world")');
window.execScript('alert("hello world")');
(<any>window).execScript('alert("hello world")');

var a = execScript('alert("hello world")');
var b = this.execScript('alert("hello world")');
var c = window.execScript('alert("hello world")');
var d = (<any>window).execScript('alert("hello world")');

