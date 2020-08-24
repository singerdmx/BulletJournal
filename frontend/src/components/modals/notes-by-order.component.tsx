import React, {useState} from 'react';
import {Checkbox, DatePicker, Divider, Empty, message, Modal, Tooltip,} from 'antd';
import {IState} from '../../store';
import {connect} from 'react-redux';
import './modals.styles.less';
import NoteItem from '../project-item/note-item.component';
import moment from 'moment';
import {CheckSquareTwoTone, CloseSquareTwoTone, DeleteTwoTone, SyncOutlined,} from '@ant-design/icons';
import {Note} from '../../features/notes/interface';
import {dateFormat} from '../../features/myBuJo/constants';
import {deleteNotes, getNotesByOrder} from '../../features/notes/actions';
import {ProjectItemUIType} from "../../features/project/constants";

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
  deleteNotes: (projectId: number, notesId: number[], type: ProjectItemUIType) => void;
};

const NotesByOrder: React.FC<NotesByOrderProps> = (props) => {
  const {
    visible,
    notesByOrder,
    projectId,
    timezone,
    getNotesByOrder,
    deleteNotes,
  } = props;
  const [dateArray, setDateArray] = useState(['', '']);
  const handleRangeChange = (dates: any, dateStrings: string[]) => {
    setDateArray([dateStrings[0], dateStrings[1]]);
  };
  const handleUpdate = () => {
    setChecked([] as number[]);
    getNotesByOrder(projectId, timezone, dateArray[0], dateArray[1]);
  };

  const [checkboxVisible, setCheckboxVisible] = useState(false);
  const [checked, setChecked] = useState([] as number[]);
  const onCheck = (id: number) => {
    if (checked.includes(id)) {
      setChecked(checked.filter((c) => c !== id));
      return;
    }

    setChecked(checked.concat([id]));
  };

  const getList = () => {
    return notesByOrder.map((note, index) => {
      return (
        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
          {checkboxVisible && (
            <Checkbox
              checked={checked.includes(note.id)}
              key={note.id}
              style={{ marginRight: '0.5rem', marginTop: '-0.5em' }}
              onChange={(e) => onCheck(note.id)}
            />
          )}
          <NoteItem
            note={note}
            type={ProjectItemUIType.ORDER}
            readOnly={false}
            inProject={false}
            inModal={true}
          />
        </div>
      );
    });
  };

  const selectAll = () => {
    setCheckboxVisible(true);
    setChecked(notesByOrder.map((n) => n.id));
  };

  const clearAll = () => {
    setCheckboxVisible(true);
    setChecked([]);
  };

  const deleteAll = () => {
    setCheckboxVisible(true);
    if (checked.length === 0) {
      message.error('No Selection');
      return;
    }

    deleteNotes(projectId, checked, ProjectItemUIType.ORDER);
    setChecked([] as number[]);
    props.onCancel();
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
              'This Month': [
                moment().startOf('month'),
                moment().endOf('month'),
              ],
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
            <Tooltip title='Refresh'>
              <SyncOutlined onClick={handleUpdate} />
            </Tooltip>
          </span>
        </div>
        <Divider />
        {notesByOrder.length === 0 ? (
          <Empty />
        ) : (
          <div>
            <div className='checkbox-actions'>
              <Tooltip title='Select All'>
                <CheckSquareTwoTone onClick={selectAll} />
              </Tooltip>
              <Tooltip title='Clear All'>
                <CloseSquareTwoTone onClick={clearAll} />
              </Tooltip>
              <Tooltip title='Delete All'>
                <DeleteTwoTone twoToneColor='#f5222d' onClick={deleteAll} />
              </Tooltip>
            </div>
            {getList()}
          </div>
        )}
      </div>
    </Modal>
  );
};

const mapStateToProps = (state: IState) => ({
  notesByOrder: state.note.notesByOrder,
  timezone: state.settings.timezone,
});

export default connect(mapStateToProps, { getNotesByOrder, deleteNotes })(
  NotesByOrder
);
