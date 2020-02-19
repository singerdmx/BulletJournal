import React from 'react';
import moment from 'moment';

type titleProps = {
  title: string;
  type: string;
  time: number;
};

function getTitleText(title: string, type: string, time: number): JSX.Element {
  let titleText = (<span>{title}</span>);
  let beg = 0;
  switch (type) {
    case 'JoinGroupEvent':
      beg = title.indexOf(' invited you to join Group ');
      titleText = (
        <span>
          <strong>{title.slice(0, beg)}</strong> invited you to join Group <strong>{title.slice(beg + 27)}</strong>
        </span>
      );
      break;
    case 'RemoveUserFromGroupEvent':
      beg = title.indexOf(' removed you from Group ');
      titleText = (
        <span>
          <strong>{title.slice(0, beg)}</strong> removed you from Group <strong>{title.slice(beg + 24)}</strong>
        </span>
      );
      break;
    case 'JoinGroupResponseEvent':
      beg = title.indexOf(' declined your invitation to join Group ');
      titleText = (
        <span>
          <strong>{title.slice(0, beg)}</strong> declined your invitation to join Group <strong>{title.slice(beg + 40)}</strong>
        </span>
      );
      if (beg < 0) {
        beg = title.indexOf(' accepted your invitation to join Group ');
        titleText = (
          <span>
            <strong>{title.slice(0, beg)}</strong> accepted your invitation to join Group <strong>{title.slice(beg + 40)}</strong>
          </span>
        );
      }
      break;
    case 'DeleteGroupEvent':
      beg = title.indexOf(' is deleted');
      titleText = (
        <span>
          Group <strong>{title.slice(6, beg)}</strong> is deleted
        </span>
      );
      break;
  }
  return titleText;
}

const ListTitle = ({ title, type, time }: titleProps) => {
  return (
    <div className="notification-title">
        {getTitleText(title, type, time)}
        <span>{moment(time).fromNow()}</span>
    </div>
  );
};

export default ListTitle;