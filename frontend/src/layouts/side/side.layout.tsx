import React, {useCallback, useEffect, useState,} from 'react';
import {Layout} from 'antd';
import SideMenu from '../../components/side-menu/side-menu.component';
import * as logo from '../../assets/favicon466.ico';
import {RightSquareOutlined} from '@ant-design/icons';
import _ from 'lodash';

import './side.styles.less';

const {Sider} = Layout;

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
                <img src={logo} alt='Icon' className='icon-img'/>
                <div className='title'>
                    <h2>Bullet Journal</h2>
                </div>
            </div>
            <SideMenu/>
            <div style={{height: '60%'}}>
                <ins
                    className='adsbygoogle'
                    style={{display: 'block'}}
                    data-ad-client='ca-pub-8783793954376932'
                    data-ad-slot='1085969972'
                    data-ad-format='auto'
                    data-full-width-responsive='true'
                ></ins>
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({});
                </script>
            </div>
            <div id='sideMenuSlider'>
                <RightSquareOutlined/>
            </div>
        </Sider>
    );
};

export default SideLayout;
