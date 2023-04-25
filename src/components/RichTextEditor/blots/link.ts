import { Quill } from 'react-quill';

const Inline = Quill.import('blots/inline');

// This will create the <a> tag within the editor blot

export class LinkBlot extends Inline {
  static create(value: string) {
    const node = super.create();
    // sanitize url value if desired
    node.setAttribute('href', value);
    // okay to set other non-format related attributes
    // these are invisible to Parchment so must be static
    node.setAttribute('target', '_blank');
    node.setAttribute('role', 'button');
    node.setAttribute('class', 'linkQuill');
    // fix: Clickable Link {https://github.com/quilljs/quill/issues/1966#issuecomment-528317638}
    node.setAttribute('contenteditable', 'false');
    return node;
  }

  static formats(node: { getAttribute: (arg0: string) => any }) {
    // we will only be called with a node already
    // determined to be a Link Blot, so we do
    // not need to check ourselves
    return node.getAttribute('href');
  }
}

LinkBlot.blotName = 'link';
LinkBlot.tagName = 'a';
