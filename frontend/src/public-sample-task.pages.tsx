import React, {useEffect} from "react";
import TaskDetailPage from "./pages/task/task-detail.pages";
import {IState} from "./store";
import {connect} from "react-redux";
import {getSampleTask} from "./features/tasks/actions";
import {useParams} from "react-router-dom";
import {Task} from "./features/tasks/interface";
import {Content} from "./features/myBuJo/interface";
import {setDisplayMore, setDisplayRevision} from "./features/content/actions";
import './Public.styles.less';
import {getRandomBackgroundImage} from "./assets/background";

interface SampleTaskProps {
    task: Task | undefined;
    theme: string;
    contents: Content[];
    getSampleTask: (taskId: number) => void;
    setDisplayMore: (displayMore: boolean) => void;
    setDisplayRevision: (displayRevision: boolean) => void;
}

const PublicSampleTaskPage: React.FC<SampleTaskProps> = (
    {task, contents, getSampleTask, setDisplayMore, setDisplayRevision}
) => {
    // get id of task from router
    const {taskId} = useParams();

    // listening on the empty state working as componentDidmount
    useEffect(() => {
        taskId && getSampleTask(parseInt(taskId));
        setDisplayMore(false);
        setDisplayRevision(false);
    }, [taskId]);

    const fullHeight = global.window.innerHeight;

    return (
        <div
            style={{
                backgroundImage: `url(${getRandomBackgroundImage()})`,
                height: `${fullHeight}px`
            }}
            className="public-container"
        >
            <TaskDetailPage
                task={task}
                labelEditable={false}
                taskOperation={() => {
                    return <span/>
                }}
                contents={contents}
                createContentElem={null}
                taskEditorElem={null}
                isPublic
            />
        </div>
    );
}

const mapStateToProps = (state: IState) => ({
    task: state.task.task,
    contents: state.task.contents,
    content: state.content.content,
    myself: state.myself.username,
    project: state.project.project
});

export default connect(mapStateToProps, {
    getSampleTask,
    setDisplayMore,
    setDisplayRevision
})(PublicSampleTaskPage);