
function documentFunction() : Document {
    return window.document;
}


document.cookie = '...';
this.document.cookie = '...';
window.document.cookie = '...';

documentFunction().cookie = '...';

var doc = document;
doc.cookie = '...';
