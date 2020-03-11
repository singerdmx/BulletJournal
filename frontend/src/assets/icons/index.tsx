import * as Icons from '@ant-design/icons';
import { Select } from 'antd';
import React from 'react';
const { Option } = Select;

type IconType = {
    name : string,
    icon : any
}

export const icons = [
  {
    name: 'medical',
    icon: <Icons.MedicineBoxOutlined />
  },
  {
      name : "tags",
      icon : <Icons.TagsOutlined />
  }
];

const getIconOptions = (icons: IconType[]) => {
  return icons.map(icon => {
    return (
        <Option value={icon.name} key={icon.name}>
            {icon.icon}
        </Option>
        )
  });
};

export const iconOptions = getIconOptions(icons);
