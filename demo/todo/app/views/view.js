class Foo {
}
const div = Ractor.createElement("div", null,
    Ractor.createElement("span", null, "111"),
    Ractor.createElement("span", null, "222"));
const foo = Ractor.createElement(Foo, { href: "1" },
    Ractor.createElement("span", null, "11"));
