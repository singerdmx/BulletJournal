import {IState} from "../../store";
import {connect} from "react-redux";
import React from "react";
import {Drawer} from "antd";

type BookMeDrawerProps = {
    timezone: string,
    bookMeDrawerVisible: boolean,
    setBookMeDrawerVisible:(v:boolean) => void;
};

const BookMeDrawer: React.FC<BookMeDrawerProps> = (props) => {
    const {timezone, setBookMeDrawerVisible, bookMeDrawerVisible} = props;

    const handleClose = (e: React.KeyboardEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>) => {
        setBookMeDrawerVisible(false);
    };

    // @ts-ignore
    const fullHeight = global.window.innerHeight;
    // @ts-ignore
    const fullWidth = global.window.innerWidth;
    const drawerWidth =
        fullWidth > fullHeight ? fullWidth * 0.75 : fullWidth;

    return <Drawer
        placement={'right'}
        onClose={(e) => handleClose(e)}
        visible={bookMeDrawerVisible}
        width={drawerWidth}
        destroyOnClose>
        <div>
            <button>Share</button>
        </div>
    </Drawer>
};

const mapStateToProps = (state: IState) => ({
    timezone: state.myself.timezone,
});

export default connect(mapStateToProps, {
})(BookMeDrawer);
