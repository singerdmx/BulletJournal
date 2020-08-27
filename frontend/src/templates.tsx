import React, {useEffect, useState} from 'react';
import {Layout, Menu, PageHeader} from 'antd';
import './styles/main.less';
import './templates.styles.less';
import './layouts/side/side.styles.less';
import {IState} from "./store";
import {connect} from "react-redux";
import {getCategories, getCategory} from "./features/templates/actions";
import {Category} from "./features/templates/interface";
import {getIcon} from "./components/draggable-labels/draggable-label-list.component";
import ReactLoading from "react-loading";
import * as logo from "./assets/favicon466.ico";
import FooterLayout from "./layouts/footer/footer.layout";

const {Content, Sider} = Layout;

type TemplatesProps = {
    categories: Category[];
    category: Category | undefined;
    getCategory: (categoryId: number) => void;
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
        category,
        getCategory
    }) => {

    const isMobilePage = () => {
        return window.navigator.userAgent.toLowerCase().includes('mobile');
    }

    useEffect(() => {
        document.title = 'Bullet Journal - Templates';
        getCategories();
        if (isMobilePage()) {
            setCollapsed(true);
            setWidth(collapsedSiderWidth);
        }
    }, []);

    const expandedSiderWidth = 240;
    const collapsedSiderWidth = 55;
    const [collapsed, setCollapsed] = useState(false);
    const [width, setWidth] = useState(expandedSiderWidth);

    const onCollapse = (collapsed: boolean) => {
        setCollapsed(collapsed);
        if (collapsed) {
            setWidth(collapsedSiderWidth);
        } else {
            setWidth(expandedSiderWidth);
        }
    }

    const getMenuItems = (categories: Category[]) => {
        if (categories && categories.length > 0) {
            return <Menu theme="dark" mode="inline" defaultSelectedKeys={categories.map(c => `${c.id}`)}>
                {categories.map(c => {
                    return <Menu.Item
                        key={`${c.id}`}
                        icon={getIcon(c.icon!)}
                        style={{backgroundColor: `${c.color}`}}
                        onClick={() => getCategory(c.id)}
                    >
                        {c.name}
                    </Menu.Item>
                })
                }
            </Menu>
        }

        return <Loading/>
    }

    const getTemplates = () => {
        if (!category) {
            return <div></div>
        }
        return <>
            <PageHeader
                title={category.name}
                tags={getIcon(category.icon!)}/>
            <div></div>
        </>
    }

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider className='sider' collapsedWidth={collapsedSiderWidth} width={width}
                   collapsible collapsed={collapsed} onCollapse={onCollapse} defaultCollapsed={false}>
                <div className='sider-header'>
                    <img src={logo} alt='Icon' className='icon-img'/>
                    <div className='title'>
                        <h2>Bullet Journal</h2>
                    </div>
                </div>
                {getMenuItems(categories)}
            </Sider>
            <Layout style={{marginLeft: `${width}px`}}>
                <Content className='content'>
                    <div className='template-content'>
                        {getTemplates()}
                    </div>
                </Content>
                {!isMobilePage() && <FooterLayout/>}
            </Layout>
        </Layout>
    )
};

const mapStateToProps = (state: IState) => ({
    categories: state.templates.categories,
    category: state.templates.category
});

export default connect(mapStateToProps, {
    getCategories,
    getCategory
})(TemplatesPage);
