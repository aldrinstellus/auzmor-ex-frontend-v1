import Quill from 'quill';
import Fuse from 'fuse.js';
import { emojiList } from './emojiList';

const Module = Quill.import('core/module');

class EmojiToolbar extends Module {
  constructor(
    quill: { getModule: (arg0: string) => any },
    options: { buttonIcon: any },
  ) {
    super(quill, options);
    this.quill = quill;
    this.toolbar = quill.getModule('toolbar');
    if (typeof this.toolbar !== 'undefined')
      this.toolbar.addHandler('emoji', this.checkPaletteExists);
    const emojiBtns = document.getElementsByClassName('ql-emoji');
    if (emojiBtns) {
      [].slice.call(emojiBtns).forEach((emojiBtn: any) => {
        emojiBtn.innerHTML = options.buttonIcon;
      });
    }
  }

  checkPaletteExists() {
    const quill = this.quill;
    fn_checkDialogOpen(quill);
    this.quill.on(
      'text-change',
      (delta: any, oldDelta: any, source: string) => {
        if (source === 'user') {
          fn_close();
        }
      },
    );
  }
}

EmojiToolbar.DEFAULTS = {
  buttonIcon:
    '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.0026 13.6693C3.3206 13.6693 0.335938 10.6846 0.335938 7.0026C0.335938 3.3206 3.3206 0.335938 7.0026 0.335938C10.6846 0.335938 13.6693 3.3206 13.6693 7.0026C13.6693 10.6846 10.6846 13.6693 7.0026 13.6693ZM4.33594 7.66927C4.33594 8.37652 4.61689 9.05479 5.11699 9.55489C5.61708 10.055 6.29536 10.3359 7.0026 10.3359C7.70985 10.3359 8.38813 10.055 8.88822 9.55489C9.38832 9.05479 9.66927 8.37652 9.66927 7.66927H4.33594ZM4.33594 6.33594C4.60115 6.33594 4.85551 6.23058 5.04304 6.04304C5.23058 5.85551 5.33594 5.60115 5.33594 5.33594C5.33594 5.07072 5.23058 4.81637 5.04304 4.62883C4.85551 4.44129 4.60115 4.33594 4.33594 4.33594C4.07072 4.33594 3.81637 4.44129 3.62883 4.62883C3.44129 4.81637 3.33594 5.07072 3.33594 5.33594C3.33594 5.60115 3.44129 5.85551 3.62883 6.04304C3.81637 6.23058 4.07072 6.33594 4.33594 6.33594ZM9.66927 6.33594C9.93449 6.33594 10.1888 6.23058 10.3764 6.04304C10.5639 5.85551 10.6693 5.60115 10.6693 5.33594C10.6693 5.07072 10.5639 4.81637 10.3764 4.62883C10.1888 4.44129 9.93449 4.33594 9.66927 4.33594C9.40405 4.33594 9.1497 4.44129 8.96216 4.62883C8.77463 4.81637 8.66927 5.07072 8.66927 5.33594C8.66927 5.60115 8.77463 5.85551 8.96216 6.04304C9.1497 6.23058 9.40405 6.33594 9.66927 6.33594Z" fill="#171717"/></svg>',
};

function findElementByClass(pathList: string | any[], customClassName: string) {
  for (let i = 0; i < pathList.length; i += 1) {
    if (
      pathList[i].className &&
      typeof pathList[i].className === 'string' &&
      pathList[i].className.includes(customClassName)
    ) {
      return pathList[i];
    }
  }
  return false;
}

function hasClass(element: { className: any }, className: any) {
  return ` ${element.className} `.indexOf(` ${className} `) > -1;
}

function fn_close() {
  const ele_emoji_plate = document.getElementById('emoji-palette');
  const element = document.getElementById('emoji-close-div');
  if (element) {
    element.style.display = 'none';
  }
  if (ele_emoji_plate) {
    ele_emoji_plate.remove();
  }
}

function fn_checkDialogOpen(quill: any) {
  const elementExists = document.getElementById('emoji-palette');
  if (elementExists) {
    elementExists.remove();
  } else {
    fn_showEmojiPalette(quill);
  }
}

function fn_showEmojiPalette(quill: {
  focus: () => void;
  getSelection: () => any;
  getBounds: (arg0: any) => any;
  container: {
    getBoundingClientRect: () => any;
    appendChild: (arg0: HTMLDivElement) => void;
  };
}) {
  const paletteWidthAndHeight = 250;
  const ele_emoji_area = document.createElement('div');
  quill.focus();
  const selection = quill.getSelection();
  if (selection == null) return;
  const selectionBounds = quill.getBounds(selection.index);
  const editorBounds = quill.container.getBoundingClientRect();
  const selectionCenter = (selectionBounds.left + selectionBounds.right) / 2;
  const selectionMiddle = (selectionBounds.top + selectionBounds.bottom) / 2;
  const paletteLeft =
    editorBounds.left + selectionCenter + paletteWidthAndHeight <=
    document.documentElement.clientWidth
      ? selectionCenter
      : editorBounds.left - paletteWidthAndHeight;
  const paletteTop =
    editorBounds.top + selectionMiddle + paletteWidthAndHeight + 10 <=
    document.documentElement.clientHeight
      ? selectionMiddle + 10
      : editorBounds.top + selectionMiddle - paletteWidthAndHeight - 10 >= 0
      ? selectionMiddle - paletteWidthAndHeight - 10
      : document.documentElement.clientHeight -
        paletteWidthAndHeight -
        editorBounds.top;

  document.getElementById('officeApp')!.appendChild(ele_emoji_area);
  const quillContainerCord = document
    .getElementById('createpost-quill')!
    .getBoundingClientRect();
  ele_emoji_area.id = 'emoji-palette';
  ele_emoji_area.style.left = `${
    paletteLeft > 310
      ? 310 + quillContainerCord.left
      : paletteLeft < 0
      ? 90 + quillContainerCord.left
      : paletteLeft + quillContainerCord.left
  }px`;
  ele_emoji_area.style.position = 'fixed';
  ele_emoji_area.style.top = `${paletteTop > 260 ? 260 : paletteTop + quillContainerCord.top}px`;

  const tabToolbar = document.createElement('div');
  tabToolbar.id = 'tab-toolbar';
  ele_emoji_area.appendChild(tabToolbar);

  // panel
  const panel = document.createElement('div');
  panel.id = 'tab-panel';
  ele_emoji_area.appendChild(panel);

  const emojiType = [
    {
      type: 'p',
      name: 'people',
      content: '<div class="emoji i-people"></div>',
    },
    {
      type: 'n',
      name: 'nature',
      content: '<div class="emoji i-nature"></div>',
    },
    { type: 'd', name: 'food', content: '<div class="emoji i-food"></div>' },
    {
      type: 's',
      name: 'symbols',
      content: '<div class="emoji i-symbols"></div>',
    },
    {
      type: 'a',
      name: 'activity',
      content: '<div class="emoji i-activity"></div>',
    },
    {
      type: 't',
      name: 'travel',
      content: '<div class="emoji i-travel"></div>',
    },
    {
      type: 'o',
      name: 'objects',
      content: '<div class="emoji i-objects"></div>',
    },
    { type: 'f', name: 'flags', content: '<div class="emoji i-flags"></div>' },
  ];

  const tabElementHolder = document.createElement('ul');
  tabToolbar.appendChild(tabElementHolder);
  if (document.getElementById('emoji-close-div') === null) {
    const closeDiv = document.createElement('div');
    closeDiv.id = 'emoji-close-div';
    document.body.addEventListener(
      'click',
      (event) => {
        if (findElementByClass(event.composedPath(), 'emoji')) {
          return;
        }
        fn_close();
      },
      false,
    );
    document.getElementsByTagName('body')[0].appendChild(closeDiv);
  } else {
    const element = document.getElementById('emoji-close-div');
    if (element) {
      element.style.display = 'block';
    }
  }

  emojiType.map((singleEmojiType) => {
    // add tab bar
    const tabElement = document.createElement('li');
    tabElement.classList.add('emoji-tab');
    tabElement.classList.add(`filter-${singleEmojiType.name}`);
    tabElement.addEventListener('click', function () {
      const tab = this?.parentElement?.querySelector('.active');
      if (tab) {
        tab.classList.remove('active');
      }
      tabElement.classList.toggle('active');
      fn_updateEmojiContainer(tabElement, panel, quill);
    });
    tabElement.innerHTML = singleEmojiType.content;
    tabElement.dataset.filter = singleEmojiType.type;
    tabElementHolder.appendChild(tabElement);
  });
  fn_emojiPanelInit(panel, quill);
}

function fn_emojiPanelInit(panel: HTMLDivElement, quill: any) {
  fn_emojiElementsToPanel('p', panel, quill);
  const element = document.querySelector('.filter-people');
  if (element) {
    element.classList.add('active');
  }
}

function fn_emojiElementsToPanel(
  type: string | Fuse.Expression,
  panel: { appendChild: (arg0: HTMLSpanElement) => void },
  quill: {
    focus: () => void;
    getSelection: () => any;
    insertEmbed: (
      arg0: any,
      arg1: string,
      arg2: {
        name: string;
        unicode: string;
        shortname: string;
        code_decimal: string;
        category: string;
        emoji_order: string;
      },
      arg3: any,
    ) => void;
    setSelection: (arg0: any) => void;
  },
) {
  const fuseOptions = {
    shouldSort: true,
    matchAllTokens: true,
    threshold: 0.3,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 3,
    keys: ['category'],
  };
  const fuse = new Fuse(emojiList, fuseOptions);
  const result = fuse.search(type);
  result.sort((a: any, b: any) => a.item.emoji_order - b.item.emoji_order);

  quill.focus();
  const range = quill.getSelection();

  result.map((emo) => {
    const emoji = emo.item;
    const span = document.createElement('span');
    const t = document.createTextNode(emoji.shortname);
    span.appendChild(t);
    span.classList.add('bem');
    span.classList.add(`bem-${emoji.name}`);
    span.classList.add('ap');
    span.classList.add(`ap-${emoji.name}`);
    const output = `${emoji.code_decimal}`;
    span.innerHTML = `${output} `;
    panel.appendChild(span);

    const customButton = document.querySelector(`.bem-${emoji.name}`);
    if (customButton) {
      customButton.addEventListener('click', () => {
        makeElement('span', {
          className: 'ico',
          innerHTML: `${emoji.code_decimal} `,
        });
        quill.insertEmbed(range.index, 'emoji', emoji, Quill); // Quill.source.USER Error source doesn't exist
        setTimeout(() => quill.setSelection(range.index + 1), 0);
        fn_close();
      });
    }
  });
}

function fn_updateEmojiContainer(
  emojiFilter: HTMLLIElement,
  panel: HTMLDivElement,
  quill: any,
) {
  while (panel.firstChild) {
    panel.removeChild(panel.firstChild);
  }
  const type: any = emojiFilter.dataset.filter;
  fn_emojiElementsToPanel(type, panel, quill);
}

function makeElement(
  tag: string,
  attrs: { [x: string]: any; className?: string; innerHTML?: string },
  ...children: undefined[]
) {
  const elem: any = document.createElement(tag);
  Object.keys(attrs).forEach((key) => (elem[key] = attrs[key]));
  children.forEach((child: any) => {
    if (typeof child === 'string') {
      child = document.createTextNode(child);
    }
    elem.appendChild(child);
  });
  return elem;
}

export default EmojiToolbar;
