import * as t from "@babel/types";

export function getName(node: t.Identifier | t.StringLiteral) {
  switch (node.type) {
    case "Identifier":
      return node.name;
    case "StringLiteral":
      return node.value;
  }
}
