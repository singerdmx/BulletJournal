import React from 'react';
import moment from 'moment';

type titleProps = {
  title: string;
  type: string;
  time: number;
};

function getTitleText(title: string): JSX.Element {
  return (<span>{title.split("##").map((s, index) => {
    if (index % 2 === 1) {
      return <strong key={index}>{s}</strong>;
    }
    return s;
  })}</span>)
}

const ListTitle = ({ title, type, time }: titleProps) => {
  return (
    <div className="notification-title">
        {getTitleText(title)}
        <span>{moment(time).fromNow()}</span>
    </div>
  );
};

export default ListTitle;