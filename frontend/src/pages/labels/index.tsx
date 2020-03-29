import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { IState } from '../../store/index';
import { Label } from '../../features/label/interface';
import LabelsWithRedux from './create-label.pages';
import LabelsSearching from './search-label.component';
import './labels.styles.less';

type LabelsPageProps = {
  labels: Label[];
  labelOptions: Label[];
};

const LablesPage: React.FC<LabelsPageProps> = props => {
  const { createOrSearch } = useParams();
  const [isSearching, setSearching] = useState(createOrSearch === 'search');
  const startSearching = () => {
    setSearching(true);
  };

  const endSearching = () => {
    setSearching(false);
  };
  return (
    <div className="labels-page">
      {isSearching ? (
        <LabelsSearching
          labelOptions={props.labelOptions}
          endSearching={endSearching}
        />
      ) : (
        <LabelsWithRedux
          labels={props.labels}
          startSearching={startSearching}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  labels: state.label.labels,
  labelsSelected: state.label.labelsSelected,
  labelOptions: state.label.labelOptions
});

export default connect(mapStateToProps)(LablesPage);
