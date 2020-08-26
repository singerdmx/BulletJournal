import React, {useEffect, useState} from 'react';
import {Layout, Menu} from 'antd';
import './styles/main.less';
import {IState} from "./store";
import {connect} from "react-redux";
import {getCategories} from "./features/templates/actions";
import {Category} from "./features/templates/interface";
import {getIcon} from "./components/draggable-labels/draggable-label-list.component";
import ReactLoading from "react-loading";

const {Sider} = Layout;

type TemplatesProps = {
    categories: Category[];
    getCategories: () => void;
};

const Loading = () => (
    <div className='loading'>
        <ReactLoading type='bubbles' color='#0984e3' height='75' width='75'/>
    </div>
);

const TemplatesPage: React.FC<TemplatesProps> = (
    {
        categories,
        getCategories,
    }) => {

    useEffect(() => {
        document.title = 'Bullet Journal - Templates';
        getCategories();
    }, []);

    const [collapsed, setCollapsed] = useState(false);

    const onCollapse = (collapsed: boolean) => {
        setCollapsed(collapsed);
    }

    const getMenuItems = (categories: Category[]) => {
        if (categories && categories.length > 0) {
            return <Menu theme="dark" mode="inline" defaultSelectedKeys={categories.map(c => `${c.id}`)}>
                {categories.map(c => {
                    return <Menu.Item key={`${c.id}`}
                                      icon={getIcon(c.icon!)} style={{backgroundColor: `${c.color}`}}>
                        {c.name}
                    </Menu.Item>
                })
                }
            </Menu>
        }

        return <Loading/>
    }

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} defaultCollapsed={false}>
                {getMenuItems(categories)}
            </Sider>
        </Layout>
    )
};

const mapStateToProps = (state: IState) => ({
    categories: state.templates.categories
});

export default connect(mapStateToProps, {
    getCategories,
})(TemplatesPage);
