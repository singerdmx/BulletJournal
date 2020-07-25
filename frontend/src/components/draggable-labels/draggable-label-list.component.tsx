import React, {useEffect, useState} from 'react';
import {Label, stringToRGB} from '../../features/label/interface';
import {Select, Tag} from 'antd';
import {useHistory} from 'react-router-dom';
import {PlusOutlined, TagOutlined} from '@ant-design/icons';
import {connect} from 'react-redux';
import {labelsUpdate, setSelectedLabel} from '../../features/label/actions';
import {setNoteLabels} from '../../features/notes/actions';
import {setTaskLabels} from '../../features/tasks/actions';
import {setTransactionLabels} from '../../features/transactions/actions';
import {setSharedItemLabels} from '../../features/system/actions';
import {ProjectType, toContentType} from '../../features/project/constants';

import {icons} from '../../assets/icons/index';
import {DragDropContext, Draggable, Droppable, DropResult,} from 'react-beautiful-dnd';
import {IState} from '../../store';
import {ProjectItem} from '../../features/myBuJo/interface';
import {Project} from '../../features/project/interface';
import {inPublicPage} from "../../index";
import {onFilterLabel} from "../../utils/Util";

type DraggableLabelsProps = {
  mode: ProjectType;
  itemShared: boolean;
  labels: Label[];
  project: Project | undefined;
  editable: boolean;
  labelOptions: Label[];
  itemId: number;
  setSelectedLabel: (label: Label) => void;
  setNoteLabels: (noteId: number, labels: number[]) => void;
  setTaskLabels: (taskId: number, labels: number[]) => void;
  setTransactionLabels: (transactionId: number, labels: number[]) => void;
  setSharedItemLabels: (itemId: string, labels: number[]) => void;
  labelsUpdate: (projectId: number | undefined) => void;
};

export const getIcon = (icon: string) => {
  let res = icons.filter((item) => item.name === icon);
  return res.length > 0 ? res[0].icon : <TagOutlined />;
};

export const getItemIcon = (
  item: ProjectItem,
  defaultElem: React.ReactNode
) => {
  if (item.labels && item.labels[0]) {
    const icon = item.labels[0].icon;
    return getIcon(icon);
  }

  return defaultElem;
};

const reorder = (list: number[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const DraggableLabelsList: React.FC<DraggableLabelsProps> = ({
  mode,
  labels,
  project,
  editable,
  itemShared,
  itemId,
  setSelectedLabel,
  setNoteLabels,
  setTaskLabels,
  setTransactionLabels,
  setSharedItemLabels,
  labelOptions,
  labelsUpdate,
}) => {
  // hook history in router
  const history = useHistory();
  const [showAdd, setShowAdd] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<number[]>([]);
  const labelsId = labels && labels.map((label) => label.id);

  const shareProjectLabelUpdate: { [key in ProjectType]: Function } = {
    [ProjectType.NOTE]: setNoteLabels,
    [ProjectType.TODO]: setTaskLabels,
    [ProjectType.LEDGER]: setTransactionLabels,
  };

  const updateLabels = shareProjectLabelUpdate[mode];

  useEffect(() => {
    if (!inPublicPage()) {
      labelsUpdate(project ? project.id : undefined);
    }
  }, []);

  useEffect(() => {
    setSelectedLabels([]);
  }, [labels]);
  // jump to label searching page by label click
  const toLabelSearching = (label: Label) => {
    setSelectedLabel(label);
    history.push('/labels/search');
  };

  const setItemLabels = (itemId: number, labels: number[]) => {
    if (itemShared) {
      setSharedItemLabels(toContentType(mode).toString().toUpperCase() + itemId, labels);
    } else {
      updateLabels(itemId, labels);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const newLabels = reorder(
      labelsId,
      result.source.index,
      result.destination.index
    );
    setItemLabels(itemId, newLabels);
  };

  const handleLabelDelete = (labelId: number) => {
    const deletedLabels = labelsId.filter((id) => id !== labelId);
    setItemLabels(itemId, deletedLabels);
  };

  const getListStyle = () => ({
    display: 'flex',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  });
  // when adding labels for note
  const handleSubmit = () => {
    const newLabels = [...labelsId, ...selectedLabels];
    setItemLabels(itemId, newLabels);
    setShowAdd(false);
  };
  // when change in selections
  const handleChange = (newlabels: number[]) => {
    setSelectedLabels([...newlabels]);
  };

  if (inPublicPage()) {
    return null;
  }

  return (
    <div className='note-labels'>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='droppable' direction='horizontal'>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle() as React.CSSProperties}
              {...provided.droppableProps}
            >
              {labels &&
                labels.map((label, index) => (
                  <Draggable
                    key={label.id}
                    draggableId={`labels-${label.id}`}
                    index={index}
                    isDragDisabled={!editable}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Tag
                          key={label.id}
                          className='labels'
                          color={stringToRGB(label.value)}
                          closable={editable}
                          onClose={() => handleLabelDelete(label.id)}
                          onClick={() => {
                            if (editable) {
                              return;
                            }
                            toLabelSearching(label);
                          }}
                          style={
                            editable
                              ? { cursor: 'grab', borderRadius: 10 }
                              : { cursor: 'pointer', borderRadius: 10 }
                          }
                        >
                          <span>
                            {getIcon(label.icon)} &nbsp;
                            {label.value}
                          </span>
                        </Tag>
                      </div>
                    )}
                  </Draggable>
                ))}
              {editable ? (
                showAdd ? (
                  <Select
                    mode='multiple'
                    filterOption={(e, t) => onFilterLabel(e, t)}
                    style={{ height: '70%', width: 100 }}
                    value={selectedLabels}
                    size='small'
                    onBlur={handleSubmit}
                    onChange={handleChange}
                  >
                    {labelOptions &&
                      labelOptions
                        .filter((option) => !labelsId.includes(option.id))
                        .map((option) => {
                          return (
                            <Select.Option key={option.value} value={option.id}>
                              {option.value}
                            </Select.Option>
                          );
                        })}
                  </Select>
                ) : (
                  <Tag
                    className='site-tag-plus'
                    style={{ height: '70%' }}
                    onClick={() => setShowAdd(true)}
                  >
                    <PlusOutlined /> New Label
                  </Tag>
                )
              ) : (
                <React.Fragment />
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  labelOptions: state.label.labelOptions,
  project: state.project.project,
});

export default connect(mapStateToProps, {
  setNoteLabels,
  setTaskLabels,
  setTransactionLabels,
  setSharedItemLabels,
  setSelectedLabel,
  labelsUpdate,
})(DraggableLabelsList);
