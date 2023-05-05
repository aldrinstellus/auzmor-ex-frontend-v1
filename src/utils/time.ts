import moment from 'moment';

export const afterXUnit = (
  x: number,
  unit: moment.unitOfTime.DurationConstructor,
) => {
  return moment().add(x, unit);
};

export const getTime = (time: string) => {
  return new Date(time).toLocaleDateString();
};
