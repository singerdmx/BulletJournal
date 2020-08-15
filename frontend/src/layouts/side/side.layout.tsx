import React, {
  createRef,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';
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

const SideLayout: React.FC<SiderProps> = (props) => {
  const [width, setWidth] = useState(249);
  const dragHandler = useCallback(
    _.throttle((e: MouseEvent) => {
      const ele = document.getElementById('sideMenuSlider');
      ele!.style.left = `${e.pageX}px`;
      setWidth((prevWidth) => e.pageX);
      props.setLayoutMarginLeft(e.pageX);
    }, 200),
    []
  );

  const onDragEnd = useCallback((e: MouseEvent) => {
    // props.setLayoutMarginLeft(e.clientX);
    document.removeEventListener('mousemove', dragHandler, false);
  }, []);

  const onDragStart = useCallback((e: MouseEvent) => {
    document.addEventListener('mousemove', dragHandler, false);
  }, []);

  useEffect(() => {
    const ele = document.getElementById('sideMenuSlider');
    ele!.addEventListener('mousedown', onDragStart, false);
    window.addEventListener('mouseup', onDragEnd);
    return () => {
      //   dragRef.current!.removeEventListener('mousedown', onDragStart, false);
      window.removeEventListener('mouseup', onDragEnd, false);
    };
  }, [onDragStart, onDragEnd]);

  return (
    <Sider width={width} className='sider'>
      <div className='sider-header'>
        <img src={logo} alt='Icon' className='icon-img' />
        <div className='title'>
          <h2>Bullet Journal</h2>
        </div>
      </div>
      <SideMenu />
      <Tooltip title='Slide' placement='right'>
        <div id='sideMenuSlider'>
          <RightSquareOutlined />
        </div>
      </Tooltip>
    </Sider>
  );
};

export default SideLayout;
