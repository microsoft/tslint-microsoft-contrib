
interface DocumentLikeAPI {
    write: ((arg : string) => void);
    writeln: ((arg : string) => void);
}

function documentLikeAPIFunction() : DocumentLikeAPI {
    return {
        write: () => {},
        writeln: () => {},
    };
}

// These usages are OK because they are not on the DOM document
var document : DocumentLikeAPI = documentLikeAPIFunction();
document.write('...');
document.writeln('...');
documentLikeAPIFunction().write('...');
documentLikeAPIFunction().writeln('...');