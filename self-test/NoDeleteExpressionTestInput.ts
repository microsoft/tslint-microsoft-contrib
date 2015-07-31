/**
 * The following code should have no errors:
 */
var x = {
    myProperty: 'sometext'
};
delete x.myProperty;

/**
 * The following code should have errors:
 */
var variableForDeletion = 10;
delete variableForDeletion;
