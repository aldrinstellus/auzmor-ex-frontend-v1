/* Library - quill-auto-links */
const DEFAULT_OPTIONS = {
  paste: true,
  type: true,
};

const REGEXP_GLOBAL = /https?:\/\/[^\s]+/g;
const REGEXP_WITH_PRECEDING_WS = /(?:\s|^)(https?:\/\/[^\s]+)/;

const sliceFromLastWhitespace = (str: string | string[]) => {
  const whitespaceI = str.lastIndexOf(' ');
  const sliceI = whitespaceI === -1 ? 0 : whitespaceI + 1;
  return str.slice(sliceI);
};

function registerTypeListener(quill: any) {
  quill.keyboard.addBinding({
    collapsed: true,
    key: ' ',
    prefix: REGEXP_WITH_PRECEDING_WS,
    handler: (
      range: { index: number },
      context: { prefix: string | string[] },
    ) => {
      const url = sliceFromLastWhitespace(context.prefix);
      const retain = range.index - url.length;
      const ops: any = retain ? [{ retain }] : [];
      ops.push(
        { delete: url.length },
        { insert: url, attributes: { link: url } },
      );
      quill.updateContents({ ops });
      return true;
    },
  });
}

function registerPasteListener(quill: any) {
  quill.clipboard.addMatcher(
    Node.TEXT_NODE,
    (node: { data: string }, delta: any) => {
      const updatedDelta = { ...delta };
      if (typeof node.data !== 'string') {
        return;
      }
      const matches = node.data.match(REGEXP_GLOBAL);
      if (matches && matches.length > 0) {
        const ops = [];
        let str = node.data;
        matches.forEach((match) => {
          const split = str.split(match);
          const beforeLink = split.shift();
          ops.push({ insert: beforeLink });
          // console.log(match, beforeLink);
          // testUrl = match;
          ops.push({ insert: match, attributes: { link: match } });
          str = split.join(match);
        });
        ops.push({ insert: str });
        updatedDelta.ops = ops;
      }
      return updatedDelta;
    },
  );
}

export default class AutoLinks {
  constructor(quill: any, options = {}) {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    if (opts.type) {
      registerTypeListener(quill);
    }
    if (opts.paste) {
      registerPasteListener(quill);
    }
  }
}
