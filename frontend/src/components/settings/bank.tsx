import React, {useEffect, useState} from "react";
import {IState} from "../../store";
import {connect} from "react-redux";
import './bank.styles.less';
import {getBankAccounts} from "../../features/myself/actions";
import {BankAccount, BankAccountType} from "../../features/transactions/interface";
import AddBankAccountModal from "../modals/add-bank.component";
import BankAccountElem, {getBankAccountTypeIcon} from "./bank-account";
import {Col, Row, Statistic, Switch} from "antd";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";

const LocaleCurrency = require('locale-currency');

type BankProps = {
    getBankAccounts: () => void;
    currency: string;
    bankAccounts: BankAccount[];
}

const BankPage: React.FC<BankProps> = (
    {
        bankAccounts,
        currency,
        getBankAccounts
    }) => {
    useEffect(() => {
        getBankAccounts();
    }, []);

    useEffect(() => {
        setAccounts(bankAccounts);
    }, [bankAccounts]);

    const [typesFilter, setTypesFilter] = useState([BankAccountType.CREDIT_CARD, BankAccountType.SAVING_ACCOUNT, BankAccountType.CHECKING_ACCOUNT]);
    const [accounts, setAccounts] = useState(bankAccounts);

    function onChange(checked: boolean, t: BankAccountType) {
        let arr = [...typesFilter]
        if (checked) {
            arr.push(t);
            console.log(arr)
            setTypesFilter(arr);
        } else {
            arr = arr.filter(e => e !== t);
            setTypesFilter(arr);
        }
        const tmp: BankAccount[] = [];
        bankAccounts.forEach(a => {
            if (arr.includes(a.accountType)) {
                tmp.push(a);
            }
        });
        setAccounts(tmp);
    }

    return <div>
        <div className='banks-banner'>
            <div className='add-bank-modal'>
                <AddBankAccountModal />
            </div>
            <Row gutter={[1, 1]}>
                {Object.values(BankAccountType).map(t => {
                    return <Col key={t} span={24}>
                        <span className='bank-type-icon'>{getBankAccountTypeIcon(t)}</span>
                        {'  '}<Switch size="small" checkedChildren={<CheckOutlined/>}
                                      unCheckedChildren={<CloseOutlined/>}
                                      checked={typesFilter.includes(t)}
                                      onChange={(checked) => onChange(checked, t)}/>
                        <span className='bank-type-icon'>{t.replace(/_/g, ' ')}</span>
                    </Col>
                })}
            </Row>

            <Statistic title={`Total Balance (${LocaleCurrency.getCurrency(currency)})`}
                       value={accounts.map(b => b.netBalance).reduce((a, b) => a + b, 0)}
                       precision={2}/>
        </div>
        <div className='banks-div'>
            {accounts && accounts.map(bankAccount => <BankAccountElem key={bankAccount.id}
                                                                      mode='card'
                                                                      bankAccount={bankAccount}/>)}
        </div>
    </div>
}

const mapStateToProps = (state: IState) => ({
    bankAccounts: state.myself.bankAccounts,
    currency: state.myself.currency
});

export default connect(mapStateToProps, {getBankAccounts})(
    BankPage
);