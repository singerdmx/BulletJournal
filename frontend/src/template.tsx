import React, {useEffect, useState} from 'react';
import {Layout} from 'antd';
import {IState} from "./store";
import {connect} from "react-redux";
import {getCategories} from "./features/templates/actions";
import {Category} from "./features/templates/interface";
import FooterLayout from "./layouts/footer/footer.layout";
import SideLayout from './layouts/templates/side.layout';
import ContentLayout from './layouts/templates/content.layout';
import {SAMPLE_TASKS, SELECTIONS, STEPS} from "./pages/templates/steps.pages";
import './template.styles.less';

type TemplatesProps = {
    reload: boolean;
    category: Category | undefined;
    getCategories: () => void;
};

const TemplatesPage: React.FC<TemplatesProps> = (
    {
        reload,
        getCategories,
    }) => {

    const isMobilePage = () => {
        return window.navigator.userAgent.toLowerCase().includes('mobile');
    }

    useEffect(() => {
        document.title = 'Templates';
        getCategories();
        if (isMobilePage()) {
            setCollapsed(true);
            setWidth(collapsedSiderWidth);
        }
    }, []);

    useEffect(() => {
        if (reload) {
            localStorage.removeItem(STEPS);
            localStorage.removeItem(SELECTIONS);
            localStorage.removeItem(SAMPLE_TASKS);
            window.location.reload();
        }
    }, [reload]);

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

    return (
        <Layout style={{minHeight: '100vh'}}>
            <SideLayout collapsedSiderWidth={collapsedSiderWidth} width={width}
                 onCollapse={onCollapse} collapsed={collapsed}></SideLayout>
            <Layout style={{marginLeft: `${width}px`}}>
                <ContentLayout></ContentLayout>
                {!isMobilePage() && <FooterLayout/>}
            </Layout>
        </Layout>
    )
};

const mapStateToProps = (state: IState) => ({
    reload: state.myself.reload
});

export default connect(mapStateToProps, {
    getCategories
})(TemplatesPage);
