import { Quill } from 'react-quill';

import { emojiList } from 'components/RichTextEditor/emoji/emojiList';

const emojiMap: any = {
  name: '',
  unicode: '',
  shortname: '',
  code_decimal: '',
  category: '',
  emoji_order: '',
};

interface IEmoji {
  name: string;
  unicode: string;
  shortname: string;
  code_decimal: string;
  category: string;
  emoji_order: string;
}

emojiList.forEach((emojiListObject: IEmoji) => {
  emojiMap[emojiListObject.name] = emojiListObject;
});

export function getEmoji(emojiName: string) {
  const emoji = emojiMap[emojiName];
  return String.fromCodePoint(...EmojiBlot.parseUnicode(emoji.unicode));
}
const Embed = Quill.import('blots/embed');

class EmojiBlot extends Embed {
  static create(value: string | number) {
    const node = super.create();
    if (typeof value === 'object') {
      EmojiBlot.buildSpan(value, node);
    } else if (typeof value === 'string') {
      const valueObj = emojiMap[value];
      if (valueObj) {
        EmojiBlot.buildSpan(valueObj, node);
      }
    }
    return node;
  }

  static value(node: { dataset: { name: any } }) {
    return node.dataset.name;
  }

  static buildSpan(
    value: any,
    node: {
      setAttribute: (arg0: string, arg1: any) => void;
      appendChild: (arg0: HTMLSpanElement) => void;
    },
  ) {
    node.setAttribute('data-name', value.name);
    const emojiSpan = document.createElement('span');
    emojiSpan.classList.add(this.emojiClass);
    emojiSpan.classList.add(this.emojiPrefix + value.name);
    // unicode can be '1f1f5-1f1ea',see emoji-list.js.
    emojiSpan.innerText = String.fromCodePoint(
      ...EmojiBlot.parseUnicode(value.unicode),
    );
    node.appendChild(emojiSpan);
  }

  static parseUnicode(string: string) {
    return string.split('-').map((str) => parseInt(str, 16));
  }
}

EmojiBlot.blotName = 'emoji';
EmojiBlot.className = 'ql-emojiblot';
EmojiBlot.tagName = 'span';
EmojiBlot.emojiClass = 'ap';
EmojiBlot.emojiPrefix = 'ap-';

export default EmojiBlot;
