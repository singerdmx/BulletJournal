import moment from 'moment';

const computeStart = ({ onDate: { date } }) => {
  // verify that incoming date is valid
  // by seeing if it can be converted into a moment object.
  // if not, then create a new date
  if (!moment.isMoment(moment(date))) {
    date = new Date().setMilliseconds(0);
  }

  return {
    dtstart: moment(date).toDate(),
  };
};

export default computeStart;
