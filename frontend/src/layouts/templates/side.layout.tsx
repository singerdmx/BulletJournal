import React from 'react';
import {Layout, Menu} from 'antd';
import * as logo from "../../assets/favicon466.ico";
import {connect} from "react-redux";
import {IState} from '../../store';
import {Loading} from '../../App';
import {Category} from '../../features/templates/interface';
import {getIcon} from '../../components/draggable-labels/draggable-label-list.component';
import {useHistory} from 'react-router-dom';

const {Sider} = Layout;

type SiderProps = {
    categories: Category[];
    collapsedSiderWidth: number;
    width: number;
    collapsed: boolean;
    onCollapse: (collapsed: boolean) => void;
};

const SideLayout: React.FC<SiderProps> = (
    {
        categories,
        collapsedSiderWidth,
        width,
        collapsed,
        onCollapse,
    }) => {
    const history = useHistory();
    const handleOnClick = (categoryId: number) => {
        history.push(`/categories/${categoryId}`);
    }

    const getMenuItems = (categories: Category[]) => {
        if (categories && categories.length > 0) {
            return <>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={categories.map(c => `${c.id}`)}>
                    {
                        categories.map(c => {
                            return <Menu.Item
                                key={`${c.id}`}
                                icon={getIcon(c.icon!)}
                                style={{backgroundColor: `${c.color}`}}
                                onClick={() => handleOnClick(c.id)}
                            >
                                {c.name}
                            </Menu.Item>
                        })
                    }
                </Menu>
                <div style={{height: '63%'}}>
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
            </>
        }
        return <Loading/>
    }

    return (
        <Sider className="sider" collapsedWidth={collapsedSiderWidth} width={width}
               collapsible collapsed={collapsed} onCollapse={onCollapse} defaultCollapsed={false}>
            <div className='sider-header'>
                <img src={logo} alt='Icon' className='icon-img'/>
                <div className='title'>
                    <h2>Bullet Journal</h2>
                </div>
            </div>
            {getMenuItems(categories)}
        </Sider>
    );
};

const mapStateToProps = (state: IState) => ({
    categories: state.templates.categories,
});

export default connect(mapStateToProps, {})(SideLayout);
  