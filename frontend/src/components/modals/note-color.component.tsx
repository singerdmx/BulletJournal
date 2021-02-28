import React, {useEffect, useState} from 'react';
import {Checkbox, Modal,} from 'antd';
import {RGBColor, SwatchesPicker} from 'react-color';
import {IState} from '../../store';
import {connect} from 'react-redux';
import './modals.styles.less';
import {BgColorsOutlined} from '@ant-design/icons';
import {updateColorSettingShown, updateNoteColor} from '../../features/notes/actions';
import {Button as FloatButton, darkColors, lightColors} from "react-floating-action-button";
import {Note} from '../../features/notes/interface';
import {swatchesPickerColors} from "../../utils/Util";

type NoteColorSettingProps = {
  note: Note | undefined;
  colorSettingShown: boolean;
  updateNoteColor: (
      noteId: number,
      color: string | undefined,
  ) => void;
  updateColorSettingShown: (
      visible: boolean
  ) => void;
};

const NoteColorSettingDialog: React.FC<NoteColorSettingProps> = (props) => {
  const {
    note,
    colorSettingShown,
    updateColorSettingShown,
    updateNoteColor,
  } = props;

  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [bgColor, setBgColor] = useState({
    r: '0',
    g: '0',
    b: '0',
    a: '0',
  });

  useEffect(() => {
    const show = !!note && !!note.color;
    setDisplayColorPicker(show);
    setBgColor(show && note?.color ? JSON.parse(note.color) : {
      r: '0',
      g: '0',
      b: '0',
      a: '0',
    });
  }, [note]);

  const onCheckColorIcon = (e: any) => {
    setDisplayColorPicker(!displayColorPicker);
    if (!e.target.checked && note) {
      updateNoteColor(note.id, undefined);
      setBgColor({
        r: '0',
        g: '0',
        b: '0',
        a: '0',
      })
    }
  }

  const handleColorChange = (c: any, event: any) => {
    if (note) {
      updateNoteColor(note.id, JSON.stringify(c.rgb));
    }
    setBgColor(c.rgb);
  };

  const color: RGBColor = {
    r: Number(bgColor.r),
    g: Number(bgColor.g),
    b: Number(bgColor.b),
    a: Number(bgColor.a),
  }

  const openModal = () => updateColorSettingShown(true);
  const closeModal = () => updateColorSettingShown(false);

  const getModal = () => (
      <Modal
          visible={colorSettingShown}
          onCancel={closeModal}
          footer={false}
      >
        <div>
          <Checkbox
              style={{marginTop: '-0.5em'}}
              checked={displayColorPicker}
              onChange={onCheckColorIcon}
          >
            Set background color
          </Checkbox>
          <BgColorsOutlined/>

          <div>
            {displayColorPicker &&
            <div>
              <SwatchesPicker
                  color={color}
                  onChange={handleColorChange}
                  width={420}
                  height={130}
                  colors={swatchesPickerColors}
              />
            </div>}
          </div>
        </div>
      </Modal>
  );

  return (
      <>
        <FloatButton
            tooltip="Set Background Color"
            onClick={openModal}
            styles={{backgroundColor: darkColors.grey, color: lightColors.white, fontSize: '25px'}}
        >
          <BgColorsOutlined/>
        </FloatButton>
        {getModal()}
      </>
  );
};

const mapStateToProps = (state: IState) => ({
  note: state.note.note,
  colorSettingShown: state.note.colorSettingShown,
});

export default connect(mapStateToProps, {
  updateColorSettingShown,
  updateNoteColor,
})(NoteColorSettingDialog);
