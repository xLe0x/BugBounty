/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => JellySnippets
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");

// src/symbol.ts
var Symbol2 = /* @__PURE__ */ ((Symbol3) => {
  Symbol3["Newline"] = "%\\n";
  Symbol3["Tab"] = "%\\t";
  Symbol3["Space"] = "%\\s";
  Symbol3["CursorEnd"] = "%\\e";
  return Symbol3;
})(Symbol2 || {});
((Symbol3) => {
  const REPLACEABLE = {
    ["%\\n" /* Newline */]: "\n",
    ["%\\t" /* Tab */]: "	",
    ["%\\s" /* Space */]: " "
  };
  function replaceSymbolsOnParse(inputStr) {
    const result = [];
    const len = inputStr.length;
    let i = 0;
    let cursor = 0;
    let endFoundIdx = -1;
    let hasNewline = false;
    let found;
    while (i < inputStr.length) {
      found = false;
      for (const symbol in REPLACEABLE) {
        if (inputStr.startsWith(symbol, i)) {
          result.push(REPLACEABLE[symbol]);
          cursor += REPLACEABLE[symbol].length;
          i += symbol.length;
          found = true;
          if (symbol == "%\\n" /* Newline */) {
            hasNewline = true;
          }
          break;
        }
      }
      if (inputStr.startsWith("%\\e" /* CursorEnd */, i)) {
        i += "%\\e" /* CursorEnd */.length;
        endFoundIdx = cursor;
        found = true;
      }
      if (!found) {
        result.push(inputStr[i]);
        cursor++;
        i++;
      }
    }
    let data = result.join("");
    let info = {
      hasNewline,
      cursorEnd: endFoundIdx < 0 ? 0 : data.length - endFoundIdx
    };
    return { data, info };
  }
  Symbol3.replaceSymbolsOnParse = replaceSymbolsOnParse;
})(Symbol2 || (Symbol2 = {}));

// main.ts
var DEFAULT_SETTINGS = {
  snippetsFile: String.raw`Snip me! |+| Snippet successfully replaced.
-==-
- |+| #####
-==-
: |+| -
-==-
:: |+| hi`,
  triggerOnSpace: "disabled" /* Disabled */,
  triggerOnEnter: "disabled" /* Disabled */,
  triggerOnTab: "disabled" /* Disabled */,
  snippetPartDivider: " |+| ",
  snippetDivider: "-==-"
};
var JellySnippets = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.multilineSnippets = {};
  }
  async onload() {
    await this.loadSettings();
    this.reloadSnippets();
    if (this.settings.triggerOnSpace !== "disabled" /* Disabled */ || this.settings.triggerOnTab !== "disabled" /* Disabled */ || this.settings.triggerOnEnter !== "disabled" /* Disabled */) {
      const onKeyEvent = (evt) => {
        if (!evt.shiftKey) {
          const mdFile = this.app.workspace.activeEditor;
          if (mdFile == null ? void 0 : mdFile.editor) {
            this.triggerSnippetAutomatically(mdFile.editor, evt);
          }
        }
      };
      this.registerDomEvent(document, "keydown", onKeyEvent);
      this.registerEvent(
        this.app.workspace.on("window-open", (event) => {
          this.registerDomEvent(activeWindow, "keydown", onKeyEvent);
        })
      );
    }
    this.addCommand({
      id: "trigger-snippet",
      name: "Trigger snippet",
      editorCallback: (editor) => {
        this.triggerSnippet(editor);
      }
    });
    this.addCommand({
      id: "reload-snippets",
      name: "Reload snippets",
      callback: () => {
        this.reloadSnippets();
      }
    });
    this.addSettingTab(new JellySnippetsSettingTab(this.app, this));
  }
  onunload() {
  }
  async loadSettings() {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      await this.loadData()
    );
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  reloadSnippets() {
    console.log("Jelly Snippets: Reloading snippets.");
    this.multilineSnippets = {};
    this.parseSnippets();
  }
  parseSnippets() {
    let snippetDivider = this.settings.snippetDivider == "\\n" ? "\n" : this.settings.snippetDivider + "\n";
    let snippetLines = this.settings.snippetsFile.split(snippetDivider);
    for (let snippet of snippetLines) {
      let snippetParts = snippet.trimEnd().split(this.settings.snippetPartDivider);
      if (snippetParts.length !== 2) {
        continue;
      }
      let lhs = snippetParts.shift();
      if (lhs === void 0) {
        console.log("Failed to register snippet: ", snippet);
        continue;
      }
      let rhsData = snippetParts.join(this.settings.snippetPartDivider);
      let rhs = Symbol2.replaceSymbolsOnParse(rhsData);
      this.multilineSnippets[lhs] = rhs;
    }
  }
  triggerSnippet(editor, pos) {
    let curpos = pos ? pos : editor.getCursor();
    return this.triggerMultilineSnippet(editor, curpos);
  }
  triggerSnippetAutomatically(editor, evt) {
    switch (evt.key) {
      case " ": {
        if (this.settings.triggerOnSpace !== "disabled" /* Disabled */) {
          if (this.triggerSnippet(editor)) {
            return true;
          }
        }
        break;
      }
      case "Tab": {
        if (this.settings.triggerOnTab === "disabled" /* Disabled */) {
          return false;
        }
        editor.exec("indentLess");
        let maybeSnippet = this.triggerSnippet(editor);
        if (maybeSnippet) {
          if (this.settings.triggerOnTab === "y-ws" /* EnabledYesWS */) {
            if (this.getSnippetType(maybeSnippet) === 0 /* SLSR */) {
              editor.exec("indentMore");
            }
          }
          return true;
        } else {
          editor.exec("indentMore");
        }
        break;
      }
      case "Enter": {
        if (this.settings.triggerOnEnter === "disabled" /* Disabled */) {
          return false;
        }
        let curpos = editor.getCursor();
        let aboveline = curpos.line - 1;
        let abovelineEnd = editor.getLine(aboveline).length;
        let peekPos = {
          line: aboveline,
          ch: abovelineEnd
        };
        let maybeSnippet = this.triggerSnippet(editor, peekPos);
        if (maybeSnippet) {
          let curpos2 = editor.getCursor();
          let curoffset = editor.posToOffset(curpos2);
          let rhsEndOffset = curoffset + maybeSnippet.rhs.info.cursorEnd;
          let rhsEndPos = editor.offsetToPos(rhsEndOffset);
          let afterSnippetLinePos = {
            line: rhsEndPos.line + 1,
            ch: 0
          };
          editor.replaceRange("", rhsEndPos, afterSnippetLinePos);
          if (this.settings.triggerOnEnter === "y-ws" /* EnabledYesWS */) {
            editor.exec("newlineAndIndent");
            curpos2 = editor.getCursor();
            editor.replaceRange(
              "",
              {
                line: curpos2.line,
                ch: 0
              },
              curpos2
            );
          }
          return true;
        } else {
          editor.setCursor(curpos);
        }
        break;
      }
      default: {
        break;
      }
    }
    return false;
  }
  triggerMultilineSnippet(editor, pos) {
    const curpos = pos ? pos : editor.getCursor();
    const curoffset = editor.posToOffset(curpos);
    const view = editor.cm;
    for (let [lhs, rhs] of Object.entries(this.multilineSnippets)) {
      const from = curoffset - lhs.length;
      const to = curoffset;
      let selected = view.state.sliceDoc(from, to);
      if (lhs === selected) {
        view.dispatch({
          changes: [
            {
              from,
              to,
              insert: rhs.data
            }
          ],
          selection: {
            anchor: from + rhs.data.length - rhs.info.cursorEnd
          }
        });
        return { lhs, rhs };
      }
    }
    return;
  }
  // Motivation:
  // Single snippets (no newlines) and multi snippets (newlines)
  // have different, weird interaction with Obsidian. Sometimes the whitespace goes through, sometimes not.
  // There needs to be a way of determining what type (mlhs->srhs? mlhs->mrhs? slhs? srhs? etc.) a snippet is.
  getSnippetType(snippet) {
    let { lhs, rhs } = snippet;
    let type = 0 /* SLSR */;
    type |= +lhs.includes("\n") ? 2 /* MLSR */ : 0;
    type |= +rhs.info.hasNewline ? 1 /* SLMR */ : 0;
    return type;
  }
  selectBackN(editor, N, pos) {
    const curpos = pos ? pos : editor.getCursor();
    let endOffset = editor.posToOffset(curpos);
    let startOffset = endOffset - N;
    if (startOffset < 0) {
      return false;
    }
    let startPos = editor.offsetToPos(startOffset);
    let endPos = editor.offsetToPos(endOffset);
    editor.setSelection(startPos, endPos);
    return true;
  }
  unselect(editor, pos) {
    if (pos)
      editor.setSelection(pos, pos);
    else
      editor.setSelection(editor.getCursor(), editor.getCursor());
  }
};
var JellySnippetsSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    let childEl = containerEl.createDiv({ cls: "jelly_snippets" });
    childEl.createEl("h2", { text: "Jelly Snippets - Settings" });
    new import_obsidian.Setting(childEl).setName("Snippets").setDesc(
      "Specify your snippets here! Format: 'before<divider>after'. Surrounding your divider with a space is recommended for readability."
    ).addTextArea(
      (textarea) => textarea.setPlaceholder(
        `before${this.plugin.settings.snippetPartDivider}after`
      ).setValue(this.plugin.settings.snippetsFile).onChange(async (value) => {
        this.plugin.settings.snippetsFile = value;
        await this.plugin.saveSettings();
        this.plugin.reloadSnippets();
      })
    );
    new import_obsidian.Setting(childEl).setName("Snippet line divider").setDesc(
      "This string will divide each separate snippet definition. (Enter the two characters '\\n' to use newlines as your separator.)"
    ).addText(
      (text) => text.setPlaceholder("-==-").setValue(this.plugin.settings.snippetDivider).onChange(async (value) => {
        this.plugin.settings.snippetDivider = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(childEl).setName("Snippet part divider").setDesc(
      "This string will divide the lhs and rhs of a snippet definition. (I recommend putting spaces in the ends of this string.)"
    ).addText(
      (text) => text.setPlaceholder(" |+| ").setValue(this.plugin.settings.snippetPartDivider).onChange(async (value) => {
        this.plugin.settings.snippetPartDivider = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(childEl).setName("Trigger on Space").setDesc(
      "If enabled, the snippet function will trigger when space is pressed (but not while shift is held)."
    ).addDropdown(
      (dropdown) => dropdown.addOption("disabled" /* Disabled */, "Disabled").addOption(
        "y-ws" /* EnabledYesWS */,
        "Enabled, also space"
      ).setValue(this.plugin.settings.triggerOnSpace).onChange(async (value) => {
        this.plugin.settings.triggerOnSpace = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(childEl).setName("Trigger on Enter").setDesc(
      "If enabled, the snippet function will trigger when enter is pressed (but not while shift is held)."
    ).addDropdown(
      (dropdown) => dropdown.addOption("disabled" /* Disabled */, "Disabled").addOption(
        "n-ws" /* EnabledNoWS */,
        "Enabled, no newline"
      ).addOption(
        "y-ws" /* EnabledYesWS */,
        "Enabled, also newline"
      ).setValue(this.plugin.settings.triggerOnEnter).onChange(async (value) => {
        this.plugin.settings.triggerOnEnter = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(childEl).setName("Trigger on Tab").setDesc(
      "If enabled, the snippet function will trigger when tab is pressed (but not while shift is held)."
    ).addDropdown(
      (dropdown) => dropdown.addOption("disabled" /* Disabled */, "Disabled").addOption(
        "n-ws" /* EnabledNoWS */,
        "Enabled, no indent"
      ).addOption(
        "y-ws" /* EnabledYesWS */,
        "Enabled, also indent on simple snippets (no newlines)"
      ).setValue(this.plugin.settings.triggerOnTab).onChange(async (value) => {
        this.plugin.settings.triggerOnTab = value;
        await this.plugin.saveSettings();
      })
    );
  }
};
