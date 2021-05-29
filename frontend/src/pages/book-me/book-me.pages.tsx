import React, {useEffect, useState} from 'react';
import {BookOutlined, CalendarOutlined} from "@ant-design/icons";
import {message, Tabs} from "antd";
import {IState} from "../../store";
import {connect} from "react-redux";
import BookMeCard from "../../components/book-me/book-me-card.component";
import CustomDurationCard from "../../components/custom-duration/custom-duration-card.component";
import './book-me.styles.less';
import {Project, ProjectsWithOwner} from "../../features/project/interface";
import {flattenOwnedProject, flattenSharedProject} from "../projects/projects.pages";
import {useHistory} from 'react-router-dom';
import {ProjectType} from "../../features/project/constants";
import AddProject from "../../components/modals/add-project.component";
import BookMeDrawer from "../../components/book-me/book-me-drawer";
import {RecurringSpan} from "../../features/bookingLink/interface";
import {addBookingLink, getBookingLinks} from "../../features/bookingLink/actions";
import moment from "moment-timezone";
import {dateFormat} from "../../features/myBuJo/constants";
import ManageBooking from "./manage-booking.pages";

const {TabPane} = Tabs;

type BookMeProps = {
    timezone: string,
    ownedProjects: Project[];
    sharedProjects: ProjectsWithOwner[];
    addBookingLink: (
        afterEventBuffer: number,
        beforeEventBuffer: number,
        endDate: string,
        expireOnBooking: boolean,
        includeTaskWithoutDuration: boolean,
        projectId: number,
        recurrences: RecurringSpan[],
        slotSpan: number,
        startDate: string,
        timezone: string,
        onSuccess: Function
    ) => void;
    getBookingLinks: () => void;
}
const BookMe: React.FC<BookMeProps> = (props) => {
    const {timezone, ownedProjects, sharedProjects, addBookingLink, getBookingLinks} = props;
    const [projects, setProjects] = useState<Project[]>([]);
    const [hasTodoProject, setHasTodoProject] = useState(false);
    const [cardIsClicked, setCardIsClicked] = useState(false);
    const [activeKey, setActiveKey] = useState('1')
    const history = useHistory();

    useEffect(() => {
        let updateProjects = [] as Project[];
        updateProjects = flattenOwnedProject(ownedProjects, updateProjects);
        updateProjects = flattenSharedProject(sharedProjects, updateProjects);
        setProjects(updateProjects.filter(p => !p.shared && p.projectType === ProjectType.TODO));
    }, [ownedProjects, sharedProjects]);

    useEffect(() => {
        setHasTodoProject(projects && projects.length !== 0);
    }, [projects])

    const createDefaultBookingLink = (slotSpan: number) => {
        const startDate = moment().add(1, 'days').format(dateFormat);
        const endDate = moment().add(1, 'month').endOf('month').format(dateFormat);
        const today = moment().format('YYYYMMDD');
        const recurringSpan1: RecurringSpan = {
            duration: 540,
            recurrenceRule: "DTSTART:" + today + "T000000Z\nRRULE:FREQ=DAILY;INTERVAL=1"
        }
        const recurringSpan2: RecurringSpan = {
            duration: 420,
            recurrenceRule: "DTSTART:" + today + "T170000Z\nRRULE:FREQ=DAILY;INTERVAL=1"
        }
        const recurringSpan3: RecurringSpan = {
            duration: 1440,
            recurrenceRule: "DTSTART:" + today + "T000000Z\nRRULE:FREQ=WEEKLY;BYDAY=SA;INTERVAL=1"
        }
        const recurringSpan4: RecurringSpan = {
            duration: 1440,
            recurrenceRule: "DTSTART:" + today + "T000000Z\nRRULE:FREQ=WEEKLY;BYDAY=SU;INTERVAL=1"
        }
        const recurrences = [recurringSpan1, recurringSpan2, recurringSpan3, recurringSpan4];

        addBookingLink(0, 0,endDate, true,
            true, projects[0].id, recurrences, slotSpan, startDate, timezone,
            () => {
                getBookingLinks();
                setActiveKey('2');
            });
    }

    const getCreateBookingDrawer = () => {
        return <BookMeDrawer bookMeDrawerVisible={cardIsClicked} setBookMeDrawerVisible={setCardIsClicked} projects={projects}/>;
    }

    const getAddProjectModal = () => {
        message.info('Please create a BuJo of type TODO first');
        return <AddProject history={history} mode={'auto'} visibleInBookMe={cardIsClicked}
                           setVisibleInBookMe={setCardIsClicked}/>
    }

    const getCardOnclick = () => {
        if (cardIsClicked) {
            return hasTodoProject ? getCreateBookingDrawer() : getAddProjectModal();
        }
        return <div/>;
    }

    function onClickCard(slotSpan: number) {
        setCardIsClicked(true);
        createDefaultBookingLink(slotSpan);
    }

    return <div className="book-me">
        <Tabs activeKey={activeKey} onChange={(e) => {
            if (e === '2') {
                getBookingLinks();
            }
            setActiveKey(e);
        }}>
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
                        <BookMeCard span={15} backgroundColor={'#EFEFF1'} imgHeight="67px" imgWidth="60px"
                                    img="https://user-images.githubusercontent.com/59456058/118382802-b83e6a80-b5ad-11eb-8a69-07e47366c622.png"
                                    onClick={() => {
                                        onClickCard(15);
                                    }}/>
                        <BookMeCard span={30} backgroundColor={'#ECD4D4'} imgHeight="60px" imgWidth="50px"
                                    img="https://user-images.githubusercontent.com/122956/118382659-6c3ef600-b5ac-11eb-8477-09e3fd4fa2ea.png"
                                    onClick={() => {
                                        onClickCard(30);
                                    }}/>
                        <BookMeCard span={60} backgroundColor={'#CCDBE2'} imgHeight="60px" imgWidth="50px"
                                    img="https://user-images.githubusercontent.com/59456058/118382868-61856080-b5ae-11eb-88e4-2ac9fa688025.png"
                                    onClick={() => {
                                        onClickCard(60);
                                    }}/>
                        <CustomDurationCard backgroundColor={'#C9CBE1'} imgHeight="60px" imgWidth="50px"
                                            img="https://user-images.githubusercontent.com/40779030/118413081-4a984a00-b652-11eb-8c01-af811b9032b2.png"
                                            onClick={(span) => onClickCard(span)}/>
                    </div>
                </div>
            </TabPane>
            <TabPane
                tab={<span><CalendarOutlined/>Manage Booking</span>}
                key="2"
            >
                <ManageBooking/>
            </TabPane>
        </Tabs>
        <div>
            {getCardOnclick()}
        </div>
    </div>
}

const mapStateToProps = (state: IState) => ({
    ownedProjects: state.project.owned,
    sharedProjects: state.project.shared,
    timezone: state.myself.timezone,
});

export default connect(mapStateToProps, {
    addBookingLink,
    getBookingLinks
})(BookMe);
