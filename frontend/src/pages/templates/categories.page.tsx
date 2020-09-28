import React, {useEffect} from 'react';
import "./category.styles.less";
import {Divider} from 'antd';
import {Category} from '../../features/templates/interface';
import {connect} from 'react-redux';
import {IState} from '../../store';
import {useHistory} from 'react-router-dom';
import {getIcon} from '../../components/draggable-labels/draggable-label-list.component';
import {SAMPLE_TASKS, SELECTIONS, STEPS} from "./steps.pages";

type CategoryProps = {
    reload: boolean;
    categories: Category[];
};

const handleOnClickCategory = (categoryId: number, history: any) => {
    if (history) {
        history.push(`/categories/${categoryId}/steps`);
    } else {
        window.location.href = `${window.location.protocol}//${window.location.host}/public/templates#/categories/${categoryId}/steps`;
    }
}

export const renderCategory = (c: Category, history: any) => {
    return <div className='category-info' key={c.id}
                onClick={() => handleOnClickCategory(c.id, history)} style={{backgroundColor: `${c.color}`}}>
        <div className='category-pic-div'>
            <img className='category-pic'
                 src={c.image!}/>
        </div>
        <div className='category-name'>
            <span>{getIcon(c.icon!)} {c.name}</span>
        </div>
    </div>
};

const CategoriesPage: React.FC<CategoryProps> = (
    {
        reload,
        categories
    }) => {
    const history = useHistory();

    useEffect(() => {
        if (reload) {
            localStorage.removeItem(STEPS);
            localStorage.removeItem(SELECTIONS);
            localStorage.removeItem(SAMPLE_TASKS);
            window.location.reload();
        }
    }, [reload]);
    
    return (
        <div className='template-content'>
            <div>
                {categories.map(c => {
                    return <>
                        <Divider>
                            <span>{getIcon(c.icon!)} {c.name}</span>
                        </Divider>
                        <div className='categories-info'>
                            {c.subCategories.map(sub => {
                                return renderCategory(sub, history);
                            })}
                        </div>
                    </>
                })}
            </div>
        </div>
    );

}

const mapStateToProps = (state: IState) => ({
    reload: state.myself.reload,
    categories: state.templates.categories,
});

export default connect(mapStateToProps, {})(CategoriesPage);
