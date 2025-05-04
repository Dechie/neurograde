import { EditorView } from "@codemirror/view";
import { HighlightStyle} from "@codemirror/language";
import {tags as t} from '@lezer/highlight';
import {cpp} from '@codemirror/lang-cpp';

// This theme maps to your :root CSS variables
document.body.dataset.theme = document.body.dataset.theme || "light";

export const myEditorTheme = EditorView.theme({
  "&": {
    color: "var(--color-foreground)",
    backgroundColor: "var(--color-background)",
  },

  ".cm-content": {
    fontFamily: "var(--font-sans)",
    fontSize: "0.95rem",
    caretColor: "var(--color-primary)",
  },

  ".cm-cursor, .cm-dropCursor": {
    borderLeftColor: "var(--color-primary)",
  },

  ".cm-activeLine": {
    backgroundColor: "var(--blue-light)",
  },

  ".cm-selectionBackground, ::selection": {
    backgroundColor: "var(--color-blue-light)",
  },

  ".cm-gutters": {
    backgroundColor: "var(--color-sidebar)",
    color: "var(--color-muted-foreground)",
    borderRight: "1px solid var(--color-border)",
  },
});

export const myHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: "var(--color-primary)" },
  { tag: [t.string, t.special(t.string)], color: "var(--color-green)" },
  { tag: [t.number, t.bool], color: "var(--color-pink)" },
  { tag: [t.comment], color: "var(--color-muted-foreground)", fontStyle: "italic" },
  { tag: t.function(t.variableName), color: "var(--color-blue)" },
  { tag: t.typeName, color: "var(--color-pink-light)" },
  { tag: t.variableName, color: "var(--color-foreground)" },
]);
