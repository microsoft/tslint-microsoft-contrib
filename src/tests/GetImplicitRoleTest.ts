import { getImplicitRole } from "../utils/getImplicitRole";
import { getJsxElementFromCode } from "../utils/JsxAttribute";
import * as chai from "chai";

/**
 * Unit test for getImplicitRole
 */
describe("getImplicitRole", () => {
    describe("a tag", () => {
        it("with href attribute, the implicit role is link", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode('<a href="hrefValue" />', "a"))).to.equal("link");
        });

        it("without href attribute, the implicit role is undefined", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<a />", "a"))).to.equal(undefined, "should undefined");
        });
    });

    describe("area tag", () => {
        it("with href attribute, the implicit role is link", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode('<area href="hrefValue" />', "area"))).to.equal("link");
        });

        it("without href attribute, the implicit role is undefined", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<area />", "area"))).to.equal(undefined, "should undefined");
        });
    });

    describe("article tag", () => {
        it("the implicit role is article", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<article />", "article"))).to.equal("article");
        });
    });

    describe("aside tag", () => {
        it("the implicit role is complementary", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<aside />", "aside"))).to.equal("complementary");
        });
    });

    describe("body tag", () => {
        it("the implicit role is document", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<body />", "body"))).to.equal("document");
        });
    });

    describe("button tag", () => {
        it("the implicit role is button", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<button />", "button"))).to.equal("button");
        });
    });

    describe("datalist tag", () => {
        it("the implicit role is listbox", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<datalist />", "datalist"))).to.equal("listbox");
        });
    });

    describe("dd tag", () => {
        it("the implicit role is definition", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<dd />", "dd"))).to.equal("definition");
        });
    });

    describe("details tag", () => {
        it("the implicit role is group", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<details />", "details"))).to.equal("group");
        });
    });

    describe("dialog tag", () => {
        it("the implicit role is dialog", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<dialog />", "dialog"))).to.equal("dialog");
        });
    });

    describe("dl tag", () => {
        it("the implicit role is list", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<dl />", "dl"))).to.equal("list");
        });
    });

    describe("dt tag", () => {
        it("the implicit role is listitem", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<dt />", "dt"))).to.equal("listitem");
        });
    });

    describe("footer tag", () => {
        it("with a ancestor of an article or section element, the implicit role is undefined", () => {
            const code1: string = `
      <article>
        <footer />
      </article>`;

            chai.expect(getImplicitRole(getJsxElementFromCode(code1, "footer"))).to.equal(undefined, "should undefined");

            const code2: string = `
      <section>
        <div>
          <footer />
        </div>
      </section>`;
            chai.expect(getImplicitRole(getJsxElementFromCode(code2, "footer"))).to.equal(undefined, "should undefined");
        });

        it("without a ancestor of an article or section element, the implicit role is contentinfo", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<footer></footer>", "footer"))).to.equal("contentinfo");
        });
    });

    describe("form tag", () => {
        it("the implicit role is form", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<form> </form>", "form"))).to.equal("form");
        });
    });

    describe("h1 tag", () => {
        it("the implicit role is heading", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<h1 />", "h1"))).to.equal("heading");
        });
    });

    describe("h2 tag", () => {
        it("the implicit role is heading", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<h2 />", "h2"))).to.equal("heading");
        });
    });

    describe("h3 tag", () => {
        it("the implicit role is heading", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<h3 />", "h3"))).to.equal("heading");
        });
    });

    describe("h4 tag", () => {
        it("the implicit role is heading", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<h4 />", "h4"))).to.equal("heading");
        });
    });

    describe("h5 tag", () => {
        it("the implicit role is heading", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<h5 />", "h5"))).to.equal("heading");
        });
    });

    describe("h6 tag", () => {
        it("the implicit role is heading", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<h6 />", "h6"))).to.equal("heading");
        });
    });

    describe("header tag", () => {
        it("with a ancestor of an article or section element, the implicit role is undefined", () => {
            const code1: string = `
      <article>
        <header />
      </article>`;

            chai.expect(getImplicitRole(getJsxElementFromCode(code1, "header"))).to.equal(undefined, "should undefined");

            const code2: string = `
      <section>
        <header />
      </section>`;
            chai.expect(getImplicitRole(getJsxElementFromCode(code2, "header"))).to.equal(undefined, "should undefined");
        });

        it("without a ancestor of an article or section element, the implicit role is banner", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<header></header>", "header"))).to.equal("banner");
        });
    });
    describe("hr tag", () => {
        it("the implicit role is separator", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<hr />", "hr"))).to.equal("separator");
        });
    });

    describe("img tag", () => {
        it("with alt attribute, the implicit role is img", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode('<img alt="altValue" />', "img"))).to.equal("img");
        });

        it("without alt attribute, the implicit role is img", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<img />", "img"))).to.equal("presentation");
        });
    });

    describe("input tag", () => {
        it("when type attribute value is button, image, reset or submit, the implicit role is button", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode('<input type="button" />', "input"))).to.equal("button");
            chai.expect(getImplicitRole(getJsxElementFromCode('<input type="image" />', "input"))).to.equal("button");
            chai.expect(getImplicitRole(getJsxElementFromCode('<input type="reset" />', "input"))).to.equal("button");
            chai.expect(getImplicitRole(getJsxElementFromCode('<input type="submit" />', "input"))).to.equal("button");
        });

        it("when type attribute value is pasword, the implicit role is textbox", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode('<input type="password" />', "input"))).to.equal("textbox");
        });

        it("when type attribute value is checkbox, the implicit role is checkbox", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode('<input type="checkbox" />', "input"))).to.equal("checkbox");
        });

        it("when type attribute value is radio, the implicit role is radio", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode('<input type="radio" />', "input"))).to.equal("radio");
        });

        it("when type attribute value is range, the implicit role is slider", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode('<input type="range" />', "input"))).to.equal("slider");
        });

        it("when type attribute value is number, the implicit role is spinbutton", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode('<input type="number" />', "input"))).to.equal("spinbutton");
        });

        it("when type attribute value is search and has no list attribute, the implicit role is searchbox", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode('<input type="search" />', "input"))).to.equal("searchbox");
        });

        it("when type attribute value is email, tel, text or url and has no list attribute, the implicit role is textbox", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode('<input type="email" />', "input"))).to.equal("textbox");
            chai.expect(getImplicitRole(getJsxElementFromCode('<input type="tel" />', "input"))).to.equal("textbox");
            chai.expect(getImplicitRole(getJsxElementFromCode('<input type="text" />', "input"))).to.equal("textbox");
            chai.expect(getImplicitRole(getJsxElementFromCode('<input type="url" />', "input"))).to.equal("textbox");
        });

        it("when type attribute value is  email, tel, text or url and has list attribute, the implicit role is combobox", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode('<input type="search" list />', "input"))).to.equal("combobox");
            chai.expect(getImplicitRole(getJsxElementFromCode('<input type="email" list />', "input"))).to.equal("combobox");
            chai.expect(getImplicitRole(getJsxElementFromCode('<input type="tel" list />', "input"))).to.equal("combobox");
            chai.expect(getImplicitRole(getJsxElementFromCode('<input type="text" list />', "input"))).to.equal("combobox");
            chai.expect(getImplicitRole(getJsxElementFromCode('<input type="url" list />', "input"))).to.equal("combobox");
        });

        it(`when type attribute value is color, date, datetime, file, hidden, month, time or week,
      the implicit role is undefined`, () => {
            chai.expect(getImplicitRole(getJsxElementFromCode('<input type="color" />', "input"))).to.equal(undefined, "should undefined");
            chai.expect(getImplicitRole(getJsxElementFromCode('<input type="date" />', "input"))).to.equal(undefined, "should undefined");
            chai.expect(getImplicitRole(getJsxElementFromCode('<input type="datetime" />', "input"))).to.equal(
                undefined,
                "should undefined"
            );
            chai.expect(getImplicitRole(getJsxElementFromCode('<input type="file" />', "input"))).to.equal(undefined, "should undefined");
            chai.expect(getImplicitRole(getJsxElementFromCode('<input type="hidden" />', "input"))).to.equal(undefined, "should undefined");
            chai.expect(getImplicitRole(getJsxElementFromCode('<input type="month" />', "input"))).to.equal(undefined, "should undefined");
            chai.expect(getImplicitRole(getJsxElementFromCode('<input type="time" />', "input"))).to.equal(undefined, "should undefined");
            chai.expect(getImplicitRole(getJsxElementFromCode('<input type="week" />', "input"))).to.equal(undefined, "should undefined");
        });
    });

    describe("li tag", () => {
        it("with a parent of ol or ul element, the implicit role is listitem", () => {
            const code1: string = `
      <ol>
        <li />
      </ol>`;

            chai.expect(getImplicitRole(getJsxElementFromCode(code1, "li"))).to.equal("listitem");

            const code2: string = `
      <ul>
        <li />
      </ul>`;

            chai.expect(getImplicitRole(getJsxElementFromCode(code2, "li"))).to.equal("listitem");
        });

        it("without a parent of ol or ul element, the implicit role is undefined", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<li />", "li"))).to.equal(undefined, "should undefined");

            const code1: string = `
      <ul>
        <div>
          <li />
        </div>
      </ul>`;

            chai.expect(getImplicitRole(getJsxElementFromCode(code1, "li"))).to.equal(undefined, "should undefined");
        });
    });

    describe("link tag", () => {
        it("with href attribute, the implicit role is link", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode('<link href="hrefValue" />', "link"))).to.equal("link");
        });

        it("without href attribute, the implicit role is undefined", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<link />", "link"))).to.equal(undefined, "should undefined");
        });
    });

    describe("main tag", () => {
        it("the implicit role is main", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<main />", "main"))).to.equal("main");
        });
    });

    describe("math tag", () => {
        it("the implicit role is math", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<math />", "math"))).to.equal("math");
        });
    });

    describe("menu tag", () => {
        it("when type attribute value is toolbar, the implicit role is toolbar", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode('<menu type="toolbar" />', "menu"))).to.equal("toolbar");
        });

        it("when type attribute value is not toolbar, the implicit role is undefined", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode('<menu type="" />', "menu"))).to.equal(undefined, "should undefined");
            chai.expect(getImplicitRole(getJsxElementFromCode("<menu />", "menu"))).to.equal(undefined, "should undefined");
        });
    });

    describe("menuitem tag", () => {
        it("when type attribute value is command, the implicit role is menuitem", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode('<menuitem type="command" />', "menuitem"))).to.equal("menuitem");
        });

        it("when type attribute value is checkbox, the implicit role is menuitemcheckbox", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode('<menuitem type="checkbox" />', "menuitem"))).to.equal("menuitemcheckbox");
        });

        it("when type attribute value is radio, the implicit role is menuitemradio", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode('<menuitem type="radio" />', "menuitem"))).to.equal("menuitemradio");
        });

        it("without type attribute or type attribute value is undefined value, the implicit role is undefined", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode('<menuitem type="" />', "menuitem"))).to.equal(undefined, "should undefined");
            chai.expect(getImplicitRole(getJsxElementFromCode("<menuitem />", "menuitem"))).to.equal(undefined, "should undefined");
        });
    });

    describe("meter tag", () => {
        it("the implicit role is progressbar", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<meter />", "meter"))).to.equal("progressbar");
        });
    });

    describe("nav tag", () => {
        it("the implicit role is navigation", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<nav />", "nav"))).to.equal("navigation");
        });
    });

    describe("ol tag", () => {
        it("the implicit role is list", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<ol />", "ol"))).to.equal("list");
        });
    });

    describe("optgroup tag", () => {
        it("the implicit role is group", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<optgroup />", "optgroup"))).to.equal("group");
        });
    });

    // need to improve ref https://www.w3.org/TR/html-aria/
    describe("option tag", () => {
        it("the implicit role is option", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<option />", "option"))).to.equal("option");
        });
    });

    describe("output tag", () => {
        it("the implicit role is status", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<output />", "output"))).to.equal("status");
        });
    });

    describe("progress tag", () => {
        it("the implicit role is progressbar", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<progress />", "progress"))).to.equal("progressbar");
        });
    });

    describe("section tag", () => {
        it("the implicit role is region", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<section />", "section"))).to.equal("region");
        });
    });

    describe("select tag", () => {
        it("the implicit role is listbox", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<select />", "select"))).to.equal("listbox");
        });
    });

    describe("summary tag", () => {
        it("the implicit role is button", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<summary />", "summary"))).to.equal("button");
        });
    });

    describe("table tag", () => {
        it("the implicit role is table", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<table />", "table"))).to.equal("table");
        });
    });

    describe("tbody tag", () => {
        it("the implicit role is rowgroup", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<tbody />", "tbody"))).to.equal("rowgroup");
        });
    });

    describe("textarea tag", () => {
        it("the implicit role is textbox", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<textarea />", "textarea"))).to.equal("textbox");
        });
    });

    describe("tfoot tag", () => {
        it("the implicit role is rowgroup", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<tfoot />", "tfoot"))).to.equal("rowgroup");
        });
    });

    describe("thead tag", () => {
        it("the implicit role is rowgroup", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<thead />", "thead"))).to.equal("rowgroup");
        });
    });

    describe("td tag", () => {
        it("the implicit role is cell", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<td />", "td"))).to.equal("cell");
        });
    });

    describe("th tag", () => {
        it("the implicit role is columnheader", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<th />", "th"))).to.equal("columnheader");
        });
    });

    describe("tr tag", () => {
        it("the implicit role is row", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<tr />", "tr"))).to.equal("row");
        });
    });

    describe("ul tag", () => {
        it("the implicit role is list", () => {
            chai.expect(getImplicitRole(getJsxElementFromCode("<ul />", "ul"))).to.equal("list");
        });
    });
});
