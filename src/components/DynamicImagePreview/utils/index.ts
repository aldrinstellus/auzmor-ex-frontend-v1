export const updateEditorValue = (users: any, label: any, hashtag: string) => {
  const userMentions = users.map((user: any) => ({
    id: user.id,
    value: user.fullName,
    denotationChar: '@',
  }));

  const text =
    userMentions
      .map((mention: any) => ` ${label} @${mention.value}`)
      .join(' ') + ` #${hashtag} `;
  const mentionSpans = userMentions
    .map(
      (mention: any) =>
        `<span class="mention" data-testid="createpost-at-item" "data-denotation-char="${mention.denotationChar}" data-id="${mention.id}" data-value="${mention.value}"><span contenteditable="false"><span class="ql-mention-denotation-char">${mention.denotationChar}</span>${mention.value}</span></span>`,
    )
    .join(' ');

  const html = `<p>${mentionSpans} <span class="mention" data-testid="createpost-hashtag-item"  data-denotation-char="#" data-value="${hashtag}"><span contenteditable="false"><span class="ql-mention-denotation-char">#</span>${hashtag}</span></span> ${label}</p>`;
  const result = [];
  for (let i = 0; i < userMentions.length; i++) {
    if (i == userMentions.length - 1) {
      result.push({ insert: ' and ' });
    }
    result.push({
      insert: {
        mention: {
          testid: 'createpost-at-item',
          denotationChar: userMentions[i].denotationChar,
          id: userMentions[i].id,
          value: `${userMentions[i].value}`,
        },
      },
    });
    if (i < userMentions.length - 1 && i != userMentions.length - 2) {
      result.push({ insert: ',' });
    }
  }

  const ops = [
    { insert: `${label} ` },
    ...result,
    {
      insert: ' \n',
    },
    {
      insert: {
        mention: {
          testid: 'createpost-hashtag-item',
          denotationChar: '#',
          value: `${hashtag}`,
        },
      },
    },
  ];

  return { text, html, editor: { ops } };
};
