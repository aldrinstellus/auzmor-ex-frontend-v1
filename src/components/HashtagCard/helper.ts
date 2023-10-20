export const getTextByCount = (count: number): string => {
  switch (count) {
    case 0:
      return 'Nobody is talking about this';
    case 1:
      return 'One person is talking about this';
    default:
      return `${count} people are talking about this`;
  }
};
