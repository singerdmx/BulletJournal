import React from 'react';
import {Layout, Tooltip} from 'antd';
import SideMenu from '../../components/side-menu/side-menu.component';
import * as logo from '../../assets/favicon466.ico';
import {RightSquareOutlined} from '@ant-design/icons';

import './side.styles.less';

const {Sider} = Layout;

type SiderProps = {
    setLayoutMarginLeft: (w: number) => void;
};

type SiderState = {
    w: number;
};

class SideLayout extends React.Component<SiderProps, SiderState> {
    state: SiderState = {
        w: 249,
    };

    onDrag = (e: React.DragEvent<HTMLDivElement>) => {
        // const elem = e.target as HTMLDivElement;
        // elem.setAttribute('style', 'left:' + e.pageX + 'px;top: 45%;');
        if (e.pageX === 0) {
            return;
        }
        this.props.setLayoutMarginLeft(e.pageX + 4);
        this.setState({w: e.pageX + 3});
    }

    onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        if (e.pageX === 0) {
            return;
        }
        const elem = e.target as HTMLDivElement;
        elem.setAttribute('style', 'left:' + e.pageX + 'px;top: 45%;opacity: 1;');
    }

    onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        const elem = e.target as HTMLDivElement;
        // e.dataTransfer.effectAllowed = 'move';
        elem.setAttribute('style', 'opacity: 0.3;');
    }

    onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        return false;
    }

    render() {
        return (
            <Sider width={this.state.w} className="sider">
                <div className="sider-header">
                    <img src={logo} alt="Icon" className="icon-img"/>
                    <div className="title">
                        <h2>Bullet Journal</h2>
                    </div>
                </div>
                <Tooltip title='Slide' placement='right'>
                    <div id='sideMenuSlider' draggable={true}
                         onDrag={this.onDrag} onDrop={this.onDrop}
                         onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
                        <RightSquareOutlined/>
                    </div>
                </Tooltip>
                <SideMenu/>
            </Sider>
        );
    }
}

export default SideLayout;
