import { IMention } from 'queries/post';

export const formatText = (text: string) => {
  return text
    .toString()
    .replace(/\n/g, '<br/>')
    .split(/(<br\/>)/)
    .map((str, index) => (str === '<br/>' ? <br key={index} /> : str));
};

export const getStyles = (attributes: any) => {
  let draft = '';
  if (attributes?.bold) {
    draft += 'font-bold ';
  }
  if (attributes?.italic) {
    draft += 'italic ';
  }
  if (attributes?.underline) {
    draft += 'underline underline-offset-auto';
  }
  return draft;
};

export const getMentionProps = (mentions: IMention[], mention: any) => {
  const result = mentions.find(
    (item) => ((item as any)?.userId || item?.entityId) === mention.id,
  );

  return {
    ...result,
    fullName: result?.name || mention.value,
  };
};
