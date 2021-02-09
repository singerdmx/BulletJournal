import React from "react";
import {IState} from "../../store";
import {connect} from "react-redux";
import './bank.styles.less';

type BankProps = {}

const BankPage: React.FC<BankProps> = (props) => {
    return <div className='banks-div'>
        <img alt='Coming Soon'
             src='https://user-images.githubusercontent.com/122956/92905797-d299c600-f3d8-11ea-813a-3ac75c2f5677.gif'/>
    </div>
}

const mapStateToProps = (state: IState) => ({});

export default connect(mapStateToProps, {})(
    BankPage
);