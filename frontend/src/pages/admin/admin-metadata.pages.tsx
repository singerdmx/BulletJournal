import React, {useEffect} from 'react';
import './admin-metadata.styles.less';
import {BackTop} from "antd";
import {IState} from "../../store";
import {connect} from "react-redux";
import {getChoiceMetadata} from "../../features/admin/actions";
import {ChoiceMetadata} from "../../features/admin/interface";


type AdminMetadataProps = {
    choiceMetadata: ChoiceMetadata[];
    getChoiceMetadata: () => void;
};

const AdminMetadataPage: React.FC<AdminMetadataProps> = (
    {
        choiceMetadata, getChoiceMetadata
    }) => {
    useEffect(() => {
        document.title = 'Bullet Journal - Metadata';
        getChoiceMetadata();
    }, []);

    return (
        <div className='metadata-page'>
            <BackTop/>
            <div>
            </div>
        </div>
    );
};

const mapStateToProps = (state: IState) => ({
    choiceMetadata: state.admin.choiceMetadata
});

export default connect(mapStateToProps, {
    getChoiceMetadata
})(AdminMetadataPage);
