import React from 'react';
import { Layout, Menu } from 'antd';
import * as logo from "../../assets/favicon466.ico";
import {connect} from "react-redux";
import { IState } from '../../store';
import {getCategories, getCategory} from "../../features/templates/actions";
import { Loading } from '../../App';
import { Category } from '../../features/templates/interface';
import { getIcon } from '../../components/draggable-labels/draggable-label-list.component';
import { useHistory } from 'react-router-dom';

const { Sider } = Layout;

type SiderProps = {
    categories: Category[];
    category: Category | undefined;
    collapsedSiderWidth: number;
    width: number;
    collapsed: boolean;
    onCollapse: (collapsed: boolean) => void;
    getCategory:(categoryId: number) => void;
};

const SideLayout: React.FC<SiderProps> = ({
    categories,
    category,
    collapsedSiderWidth,
    width,
    collapsed,
    onCollapse,
    getCategory,
}) => {
    const history = useHistory();
    const handleOnClick = (categoryId: number) => {
        getCategory(categoryId);
        history.push("/");
    }

    const getMenuItems = (categories: Category[]) => {
        if (categories && categories.length > 0) {
            return <Menu theme="dark" mode="inline" defaultSelectedKeys={categories.map(c => `${c.id}`)}>
                {categories.map(c => {
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
    category: state.templates.category
});

export default connect(mapStateToProps, {
    getCategories,
    getCategory
})(SideLayout);
  