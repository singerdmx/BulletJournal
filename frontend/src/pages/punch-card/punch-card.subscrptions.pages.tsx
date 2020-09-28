import React, {useEffect} from 'react';
import './punch-card.styles.less';
import {Empty} from "antd";
import {IState} from "../../store";
import {connect} from "react-redux";
import {getSubscribedCategories} from "../../features/myself/actions";
import {SubscribedCategory} from "../../features/myself/interface";
import {renderCategory} from "../templates/categories.page";
import '../templates/category.styles.less';

type TemplateSubscriptionsProps = {
    subscribedCategories: SubscribedCategory[];
    getSubscribedCategories: () => void;
};

const TemplateSubscriptions: React.FC<TemplateSubscriptionsProps> = (
    {
        subscribedCategories,
        getSubscribedCategories
    }) => {

    useEffect(() => {
        getSubscribedCategories();
    }, []);

    if (subscribedCategories.length === 0) {
        return <div className='events-card'>
            <Empty/>
        </div>
    }

    return (
        <div className='categories-info'>
            {subscribedCategories.map(subscribedCategory => {
                return <div>
                    {renderCategory(subscribedCategory.category, undefined)}
                    <div className='selections-card'>
                        {subscribedCategory.selections.map(s => {
                            return <div>{s.text}</div>
                        })}
                    </div>
                </div>
            })}
        </div>
    );
};

const mapStateToProps = (state: IState) => ({
    subscribedCategories: state.myself.subscribedCategories
});

export default connect(mapStateToProps, {getSubscribedCategories})(TemplateSubscriptions);
