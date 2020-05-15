import React, { useState } from 'react';
import {Modal, Empty, DatePicker, Divider, Tooltip} from 'antd';
import { IState } from '../../store';
import { connect } from 'react-redux';
import './modals.styles.less';
import NoteItem from '../project-item/note-item.component';
import moment from 'moment';
import { SyncOutlined } from '@ant-design/icons';
import { Note } from '../../features/notes/interface';
import { dateFormat } from '../../features/myBuJo/constants';
import { getNotesByOrder } from '../../features/notes/actions';
const { RangePicker } = DatePicker;
type NotesByOrderProps = {
  timezone: string;
  projectId: number;
  notesByOrder: Note[];
  visible: boolean;
  onCancel: () => void;
  getNotesByOrder: (
    projectId: number,
    timezone: string,
    startDate?: string,
    endDate?: string
  ) => void;
};

const NotesByOrder: React.FC<NotesByOrderProps> = (props) => {
  const { visible, notesByOrder, projectId, timezone, getNotesByOrder } = props;
  const [dateArray, setDateArray] = useState(['', '']);
  const handleRangeChange = (dates: any, dateStrings: string[]) => {
    setDateArray([dateStrings[0], dateStrings[1]]);
  };
  const handleUpdate = () => {
    getNotesByOrder(projectId, timezone, dateArray[0], dateArray[1]);
  };
  return (
    <Modal
      title={'Note(s) ordered by update time'}
      visible={visible}
      onCancel={props.onCancel}
      footer={false}
    >
      <div>
        <div className='range-picker'>
          <RangePicker
              ranges={{
                Today: [moment(), moment()],
                'This Week': [moment().startOf('week'), moment().endOf('week')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
              }}
              value={
                dateArray[0] ? [moment(dateArray[0]), moment(dateArray[1])] : null
              }
              size='small'
              allowClear={true}
              format={dateFormat}
              placeholder={['Start Date', 'End Date']}
              onChange={handleRangeChange}
          />
          <span>
            <Tooltip title='Refresh'><SyncOutlined onClick={handleUpdate} /></Tooltip>
          </span>
        </div>
        <Divider />
        {notesByOrder.length === 0 ? (
          <Empty />
        ) : (
          notesByOrder.map((note, index) => {
            return (
              <div key={index}>
                <NoteItem
                  note={note}
                  readOnly={false}
                  inProject={false}
                  inModal={true}
                />
              </div>
            );
          })
        )}
      </div>
    </Modal>
  );
};

const mapStateToProps = (state: IState) => ({
  notesByOrder: state.note.notesByOrder,
  timezone: state.settings.timezone,
});

export default connect(mapStateToProps, { getNotesByOrder })(NotesByOrder);
