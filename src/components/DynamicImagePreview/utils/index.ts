export const updateEditorValue = (users: any, label: any, hashtag: string) => {
  const userMentions = users.map((user: any) => ({
    id: user.id,
    value: user?.preferredName || user.fullName,
    denotationChar: '@',
  }));
  const result: any =
    userMentions.length === 0
      ? []
      : [
          {
            insert: {
              mention: {
                testid: 'createpost-at-item',
                denotationChar: userMentions[0].denotationChar,
                id: userMentions[0].id,
                value: `${userMentions[0].value}`,
              },
            },
          },
        ];

  for (let i = 1; i < userMentions.length; i++) {
    if (i == userMentions.length - 1) {
      result.push({ insert: ' and ' });
    } else {
      result.push({ insert: ', ' });
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

  return { text: '', html: '', editor: { ops } };
};
