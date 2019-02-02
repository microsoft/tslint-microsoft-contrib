module.exports = recommendations => `{
    "rulesDirectory": ["../"],
    "rules": {
${[...recommendations].sort().join('\n')}
    }
}`;
