interface DocumentLikeAPI {
    cookie: string;
}

function documentLikeAPIFunction(): DocumentLikeAPI {
    return null;
}

// These usages are OK because they are not on the DOM document
var document2: DocumentLikeAPI = documentLikeAPIFunction();
document2.cookie = '...';
document2.cookie = '...';
documentLikeAPIFunction().cookie = '...';
