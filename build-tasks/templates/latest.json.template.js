module.exports = recommendations => `{
    "extends": ["./recommended.json"],
    "rulesDirectory": ["../"],
    "rules": {
${[...recommendations].sort().join(',\n')}
    }
}
`;
