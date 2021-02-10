import React, {useEffect} from "react";
import {IState} from "../../store";
import {connect} from "react-redux";
import './bank.styles.less';
import {getBankAccounts} from "../../features/myself/actions";

type BankProps = {
    getBankAccounts: () => void;
}

const BankPage: React.FC<BankProps> = (
    {
        getBankAccounts
    }) => {
    useEffect(() => {
        getBankAccounts();
    }, []);

    return <div className='banks-div'>
        <img alt='Coming Soon'
             src='https://user-images.githubusercontent.com/122956/92905797-d299c600-f3d8-11ea-813a-3ac75c2f5677.gif'/>
    </div>
}

const mapStateToProps = (state: IState) => ({
    bankAccounts: state.myself.bankAccounts
});

export default connect(mapStateToProps, {getBankAccounts})(
    BankPage
);