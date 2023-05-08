import { IMention } from 'queries/post';
import React from 'react';

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
    draft += 'underline-offset-auto	';
  }
  return draft;
};

export const getMentionProps = (mentions: IMention[], mention: any) => {
  const result = mentions.find((item) => item?.entityId === mention.id);
  return {
    fullName: result?.name || mention.value,
    email: result?.email,
    image: result?.image,
  };
};
