import React from 'react';
import {BookOutlined, CalendarOutlined} from "@ant-design/icons";
import {Tabs} from "antd";
import {IState} from "../../store";
import {connect} from "react-redux";
import BookMeCard from "../../components/book-me/book-me-card.component";
import './book-me.styles.less';

const {TabPane} = Tabs;

type BookMeProps = {}
const BookMe: React.FC<BookMeProps> = (props) => {

    return <div className="book-me">
        <Tabs defaultActiveKey="1">
            <TabPane
                tab={<span><BookOutlined/>Create Booking</span>}
                key="1"
            >
                <div className="create-booking">
                    <div className="book-me-banner">
                        <h1>Meet the Way You Want</h1>
                        <span>Connect with your calendar and only share the times you want with your invitee.</span>
                        <br/>
                        <span>When your invitee chooses a meeting slot, it's instantly confirmed.</span>
                    </div>
                    <div className="book-me-cards">
                        <BookMeCard span={15} backgroundColor={'#EFEFF1'} imgHeight="67px" imgWidth="60px" img="https://user-images.githubusercontent.com/59456058/118382802-b83e6a80-b5ad-11eb-8a69-07e47366c622.png"/>
                        <BookMeCard span={30} backgroundColor={'#ECD4D4'} imgHeight="60px" imgWidth="50px" img="https://user-images.githubusercontent.com/122956/118382659-6c3ef600-b5ac-11eb-8477-09e3fd4fa2ea.png"/>
                        <BookMeCard span={60} backgroundColor={'#CCDBE2' } imgHeight="60px" imgWidth="50px" img="https://user-images.githubusercontent.com/59456058/118382868-61856080-b5ae-11eb-88e4-2ac9fa688025.png"/>
                    </div>
                </div>
            </TabPane>
            <TabPane
                tab={<span><CalendarOutlined/>Manage Booking</span>}
                key="2"
            >
                Tab 2
            </TabPane>
        </Tabs>
    </div>
}

const mapStateToProps = (state: IState) => ({});

export default connect(mapStateToProps, {})(BookMe);
