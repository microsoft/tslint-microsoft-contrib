module.exports = rows =>
    `/**
 * These rule settings are a broad, general recommendation for a good default configuration.
 * This file is exported in the npm/nuget package as ./tslint.json.
 */
module.exports = {
    "rules": {

        /**
         * Security Rules. The following rules should be turned on because they find security issues
         * or are recommended in the Microsoft Secure Development Lifecycle (SDL)
         */
${rows.Security.join("\n")}

        /**
         * Common Bugs and Correctness. The following rules should be turned on because they find
         * common bug patterns in the code or enforce type safety.
         */
${rows.Correctness.join("\n")}

        /**
         * Code Clarity. The following rules should be turned on because they make the code
         * generally more clear to the reader.
         */
${rows.Clarity.join("\n")}

        /**
         * Accessibility. The following rules should be turned on to guarantee the best user
         * experience for keyboard and screen reader users.
         */
${rows.Accessibility.join("\n")}

        /**
         * Whitespace related rules. The only recommended whitespace strategy is to pick a single format and
         * be consistent.
         */
${rows.Whitespace.join("\n")}

        /**
         * Controversial/Configurable rules.
         */
${rows.Configurable.join("\n")}

        /**
         * Deprecated rules.  The following rules are deprecated for various reasons.
         */
${rows.Deprecated.join("\n")}
    }
};
`;
