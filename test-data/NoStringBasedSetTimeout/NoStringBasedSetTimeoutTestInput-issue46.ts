class TestClassIssue46 {
    constructor(private window) {
        //Arrow Functions
        setTimeout(() => {}, 100);
        window.setTimeout(() => {}, 100);

        //Standard Functions
        setTimeout(function() {}, 100);
        window.setTimeout(function() {}, 100);

        //Strings
        const alertNum = 1;
        setTimeout("alert(" + alertNum + ")", 100);
        window.setTimeout("alert(" + alertNum + ")", 100);

        //TS Template Strings
        setTimeout(`alert(${alertNum})`, 100);
        window.setTimeout(`alert(${alertNum})`, 100);
    }
}
