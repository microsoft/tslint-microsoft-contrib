declare function evalScript(x: string): any;
interface Window {
    evalScript(x: string): any;
}


evalScript('alert("hello world")');
this.evalScript('alert("hello world")');
window.evalScript('alert("hello world")');
(<any>window).evalScript('alert("hello world")');

var a = evalScript('alert("hello world")');
var b = this.evalScript('alert("hello world")');
var c = window.evalScript('alert("hello world")');
var d = (<any>window).evalScript('alert("hello world")');

