const paramDestructuringSchema = require("..");

const toGhost = (
  {
    foo: { bar, baz },
    "..": {
      bim: [boo],
    },
  },
  {
    blow: [
      {
        bum: [bobbies, [booties]],
      },
    ],
  }
) => {
  // code for the function
};

describe("paramDestructuringSchema", () => {
  it("should handle simple params", () => {
    expect(
      paramDestructuringSchema(({ foo }) => {
        // blah blah code blah blah
      })
    ).toEqual({ 0: { foo: null }, length: 1 });
  });

  it("should ignore dependencies reffed in function bodies", () => {
    expect(
      paramDestructuringSchema(({ foo }) => {
        // blah blah code blah blah
        foo.whatever()
      })
    ).toEqual({ 0: { foo: null }, length: 1 });
  });

  it("should handle array destructuring in params", () => {
    expect(
      paramDestructuringSchema(({ foo }, [bar, baz]) => {
        // blah blah code blah blah
      })
    ).toEqual({ 0: { foo: null }, 1: { 0: null, 1: null }, length: 2 });

    expect(
      paramDestructuringSchema(([bar, baz], { foo }) => {
        // blah blah code blah blah
      })
    ).toEqual({ 0: { 0: null, 1: null }, 1: { foo: null }, length: 2 });
  });

  it("should sniff out a schema from a function with complex params", () => {
    const memo = paramDestructuringSchema(toGhost);
    expect(memo).toEqual({
      0: {
        // <- argument 1
        foo: {
          bar: null,
          baz: null,
        },
        "..": {
          bim: {
            0: null,
          },
        },
      },
      1: {
        // <- argument 2
        blow: {
          0: {
            bum: {
              0: null,
              1: {
                0: null,
              },
            },
          },
        },
      },
      length: 2,
    });
  });
});
