
interface DocumentLikeAPI {
    cookie: string;
}

function documentLikeAPIFunction() : DocumentLikeAPI {
    return null;
}

// These usages are OK because they are not on the DOM document
var document : DocumentLikeAPI = documentLikeAPIFunction();
document.cookie = '...';
document.cookie = '...';
documentLikeAPIFunction().cookie = '...';