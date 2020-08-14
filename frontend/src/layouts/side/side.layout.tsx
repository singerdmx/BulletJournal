import React from 'react';
import { Layout, Tooltip } from 'antd';
import SideMenu from '../../components/side-menu/side-menu.component';
import * as logo from '../../assets/favicon466.ico';
import { RightSquareOutlined } from '@ant-design/icons';
import _ from 'lodash';

import './side.styles.less';

const { Sider } = Layout;

type SiderProps = {
  setLayoutMarginLeft: (w: number) => void;
};

type SiderState = {
  w: number;
  isDragging: boolean;
};

class SideLayout extends React.Component<SiderProps, SiderState> {
  constructor(props: SiderProps) {
    super(props);
    this.state = {
      w: 249,
      isDragging: false,
    };
  }

  dragHandler = _.throttle((e: React.DragEvent<HTMLDivElement>) => {
    // const elem = e.target as HTMLDivElement;
    // elem.setAttribute('style', 'left:' + e.clientX + 'px;top: 45%;');
    if (!this.state.isDragging) {
      return;
    }
    this.props.setLayoutMarginLeft(e.clientX);
    this.setState({ w: e.clientX });
  }, 200);

  onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    const elem = e.target as HTMLDivElement;
    elem.setAttribute('style', `left: ${e.clientX}px;top: 45%;opacity: 1;`);
    this.props.setLayoutMarginLeft(e.clientX);
    this.setState({ isDragging: false, w: e.clientX });
  };

  onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const elem = e.target as HTMLDivElement;
    // e.dataTransfer.effectAllowed = 'move';
    elem.setAttribute('style', 'opacity: 0.3;');
    this.setState({ isDragging: true });
  };

  render() {
    return (
      <Sider width={this.state.w} className='sider'>
        <div className='sider-header'>
          <img src={logo} alt='Icon' className='icon-img' />
          <div className='title'>
            <h2>Bullet Journal</h2>
          </div>
        </div>
        <Tooltip title='Slide' placement='right'>
          <div
            id='sideMenuSlider'
            draggable
            onDrag={this.dragHandler}
            onDragEnd={this.onDragEnd}
            onDragStart={this.onDragStart}
            style={{ zIndex: 19999 }}
          >
            <RightSquareOutlined />
          </div>
        </Tooltip>
        <SideMenu />
      </Sider>
    );
  }
}

export default SideLayout;
