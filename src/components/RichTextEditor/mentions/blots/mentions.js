import { Quill } from 'react-quill';

const Embed = Quill.import('blots/embed');

// create function for rendering the custom component

export class MentionBlot extends Embed {
  hoverHandler;

  constructor(scroll, node) {
    super(scroll, node);
    this.clickHandler = null;
    this.hoverHandler = null;
    this.mounted = false;
  }

  static showUserProfileCard(e) {
    // write javascript code
  }

  static setDataValues(element, data) {
    const domNode = element;
    Object.keys(data).forEach((key) => {
      domNode.dataset[key] = data[key];
    });
    return domNode;
  }

  static value(domNode) {
    return domNode.dataset;
  }

  // create mention node on editor quill
  static create(data) {
    const node = super.create();
    const denotationChar = document.createElement('span');
    denotationChar.className = 'ql-mention-denotation-char';
    // Make change over the node like based on requirement
    // Example -> InActive people show differently with style
    if (data.status === 'DELETED') {
      node.className += ' inactive-mention';
    }
    // add on-click event listener to show the profile card
    // or else on-hover etc...
    node.addEventListener('mouseover', this.showUserProfileCard);
    denotationChar.innerHTML = data.denotationChar;
    node.appendChild(denotationChar);
    node.innerHTML += data.value; // dynamic
    return MentionBlot.setDataValues(node, data);
  }

  attach() {
    super.attach();

    if (!this.mounted) {
      this.mounted = true;
      this.clickHandler = this.getClickHandler();
      this.hoverHandler = this.getHoverHandler();

      this.domNode.addEventListener('click', this.clickHandler, false);
      this.domNode.addEventListener('mouseenter', this.hoverHandler, false);
    }
  }

  detach() {
    super.detach();
    this.mounted = false;
    if (this.clickHandler) {
      this.domNode.removeEventListener('click', this.clickHandler);
      this.clickHandler = null;
    }
  }

  getClickHandler() {
    return (e) => {
      const event = this.buildEvent('mention-clicked', e);
      window.dispatchEvent(event);
      e.preventDefault();
    };
  }

  getHoverHandler() {
    return (e) => {
      const event = this.buildEvent('mention-hovered', e);
      window.dispatchEvent(event);
      e.preventDefault();
    };
  }

  buildEvent(name, e) {
    const event = new Event(name, {
      bubbles: true,
      cancelable: true,
    });
    event.value = Object.assign({}, this.domNode.dataset);
    event.event = e;
    return event;
  }
}

MentionBlot.blotName = 'mention';
MentionBlot.tagName = 'span'; // finally found the issue (main node of mention tag)
MentionBlot.className = 'mention';
