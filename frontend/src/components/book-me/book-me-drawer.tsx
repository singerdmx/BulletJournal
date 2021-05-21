import {IState} from "../../store";
import {connect} from "react-redux";
import React, {useState} from "react";
import {DatePicker, Drawer, Form, Input, Select} from "antd";
import moment from "moment";
import {dateFormat} from "../../features/myBuJo/constants";
import {BookingLink} from "../../features/bookingLink/interface";
import {ClockCircleFilled} from "@ant-design/icons";
import {Project} from "../../features/project/interface";
import {zones} from "../settings/constants";

const {Option} = Select;
const {TextArea} = Input;

type BookMeDrawerProps = {
    bookMeDrawerVisible: boolean,
    setBookMeDrawerVisible: (v: boolean) => void;
    link: BookingLink | undefined;
    projects: Project[];
};

const {RangePicker} = DatePicker;

const BookMeDrawer: React.FC<BookMeDrawerProps> = (props) => {
    const {setBookMeDrawerVisible, bookMeDrawerVisible, link, projects} = props;
    const [dateArray, setDateArray] = useState(['', '']);

    const handleClose = () => {
        setBookMeDrawerVisible(false);
    };

    const onChangeDescription = (description: string) => {
        if (link) {
            // @ts-ignore
            link.location = description;
        }
        console.log(link?.location)
    };

    // @ts-ignore
    const fullHeight = global.window.innerHeight;
    // @ts-ignore
    const fullWidth = global.window.innerWidth;
    const drawerWidth =
        fullWidth > fullHeight ? fullWidth * 0.75 : fullWidth;

    const getSlotSpan = (slotSpan: number) => {
        if (slotSpan > 60) {
            const min = slotSpan % 60;
            const hr = Math.floor(slotSpan / 60);
            return (hr === 0 ? "" : hr + " hr ") + (min === 0 ? "" : min + " min");
        } else if (slotSpan === 60) {
            return "1 hr";
        } else {
            return slotSpan + " min";
        }
    }

    const handleRangeChange = (dates: any, dateStrings: string[]) => {
        setDateArray([dateStrings[0], dateStrings[1]]);
    };

    if (link) {
        return <Drawer
            placement={'right'}
            onClose={(e) => handleClose()}
            visible={bookMeDrawerVisible}
            width={drawerWidth}
            destroyOnClose>
            <div >
                <div style={{borderBottom: "1px solid black", display:"flex", flexDirection: "row"}}>

                    <div>
                        <h1>
                            {getSlotSpan(link.slotSpan)} Booking
                        </h1>
                        <ClockCircleFilled/> {getSlotSpan(link.slotSpan)}
                    </div>

                </div>


                <div className="option-container">
                    <span>Time Range: </span>
                    <RangePicker
                        ranges={{
                            Today: [moment(), moment()],
                            'This Week': [moment().startOf('week'), moment().endOf('week')],
                            'This Month': [
                                moment().startOf('month'),
                                moment().endOf('month'),
                            ],
                        }}
                        value={
                            dateArray[0] ? [moment(dateArray[0]), moment(dateArray[1])] : null
                        }
                        size="small"
                        allowClear={true}
                        format={dateFormat}
                        placeholder={['Start Date', 'End Date']}
                        onChange={handleRangeChange}
                    />

                </div>
                <div className="option-container">
                    <span>Time Zone: </span>
                    <Select
                        showSearch={true}
                        style={{ width: 250 }}
                        placeholder='Select Time Zone'
                        onChange={() =>console.log('d')}
                        value={link.timezone}
                    >
                        {zones.map((zone: string) => (
                            <Option key={zone} value={zone} title={zone}>
                                {zone}
                            </Option>
                        ))}
                    </Select>
                </div>
                <div className="option-container">
                    <span>Project: </span>
                    <Select
                        defaultValue={link.project.name} style={{width: 200}}
                        onChange={() => console.log('d')}
                        onClick={(e) =>  e.stopPropagation()}
                    >
                        {projects.map(project => <Option value={project.name} key={project.name}>{project.name}</Option>)}
                    </Select>
                </div>
                <div className="option-container">
                    <span>Where: </span>
                    <TextArea
                        placeholder="web link, phone number or physical address"
                        autoSize
                        value={link.location}
                        onChange={(e) => onChangeDescription(e.target.value)}
                    />
                </div>
                <div className="option-container">
                    <span>Note: </span>

                </div>
                <div>
                    {/*2 checkbox*/}
                </div>

                <div>
                    <button >share</button>

                </div>
            </div>
        </Drawer>
    }

    return <></>;
};

const mapStateToProps = (state: IState) => ({
    link: state.bookingReducer.link,
});

export default connect(mapStateToProps, {})(BookMeDrawer);
