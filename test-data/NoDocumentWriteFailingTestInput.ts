
function documentFunction() : Document {
    return window.document;
}


document.write('...');
document.writeln('...');
this.document.write('...');
this.document.writeln('...');
window.document.write('...');
window.document.writeln('...');

documentFunction().write('...');
documentFunction().writeln('...');

var doc = document;
doc.write('...');
doc.writeln('...');
