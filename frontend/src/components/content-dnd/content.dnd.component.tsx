import React, {useState, useEffect} from "react";
import {DragDropContext, Droppable, Draggable, DraggingStyle, NotDraggingStyle} from "react-beautiful-dnd";
import {RouteComponentProps, withRouter} from "react-router";
import {IState} from "../../store";
import {connect} from "react-redux";
import {Content, ProjectItem} from "../../features/myBuJo/interface";
import {Avatar, Empty} from "antd";
import ContentItem from "../content/content-item.component";
import moment from "moment";

const reorder = (contents: Content[], startIndex: number, endIndex: number) => {
    console.log(contents + " " + startIndex + " " + endIndex)
    const result = [...contents];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const grid = 8;

const getItemStyle = (isDragging: boolean, draggableStyle: DraggingStyle | NotDraggingStyle | undefined) => {
    return ({
        // userSelect: "none",
        padding: grid * 2,
        margin: `0 0 ${grid}px 0`,
        borderRadius: "8px",
        background: isDragging ? "lightgreen" : "white",
        ...draggableStyle
    });
};

const getListStyle = (isDraggingOver: boolean) => ({
    background:isDraggingOver?"grey":"#1890ff",
    padding: grid * 2,
    width: 450,
    borderRadius: "8px",
});

type ContentProps = {
    contents: Content[];
    projectItem: ProjectItem;
}

const ContentDnd: React.FC<RouteComponentProps & ContentProps> = (props) => {
    const [contentsOnOrder, setContentsOnOrder] = useState(props.contents)
    useEffect(() => {
        setContentsOnOrder(props.contents)
    },[props.contents])

    const onDragEnd = (result: any) => {
        if (!result.destination) {
            return;
        }
        const reorderedContents = reorder(
            contentsOnOrder,
            result.source.index,
            result.destination.index
        );
        setContentsOnOrder(reorderedContents)
    }

    if (props.contents.length === 0) {
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>;
    }
    let i = 0;
    return (
        <div className="draggable-contents">
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="content-droppable">
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            key={i++}
                            style={getListStyle(snapshot.isDraggingOver)}
                        >
                            {contentsOnOrder.map((content, index) => (
                                <Draggable key={content.id} draggableId={content.id.toString(10)} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            )}
                                        >
                                            <div>
                                                <Avatar src={content.owner.avatar} size='small'/>
                                                {content.owner.alias + " "}
                                                {`${moment(content.updatedAt).format('MMM Do YYYY')} (${moment(content.updatedAt).fromNow()})`}
                                                <div style={{ maxHeight: "50px",
                                                    width: "400px",
                                                    overflowY: "scroll"}}>
                                                    <ContentItem
                                                        projectItem={props.projectItem}
                                                        key={content.id}
                                                        content={content}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );

}

const mapStateToProps = (state: IState) => ({

});

export default connect(mapStateToProps, {})(
    withRouter(ContentDnd)
);

