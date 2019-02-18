module.exports = recommendations => `{
    "extends": ["./stable.json"],
    "rulesDirectory": ["../"],
    "rules": {
${[...recommendations].sort().join(',\n')}
    }
}
`;
