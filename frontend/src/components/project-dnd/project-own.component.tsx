import React from 'react';
import {History} from 'history';
import {Tree} from 'antd';
import {TreeNodeNormal} from 'antd/lib/tree/Tree';
import {Project} from '../../features/project/interface';
import {updateProjectRelations} from '../../features/project/actions';
import {
    CarryOutOutlined,
    AccountBookOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import {withRouter, RouteComponentProps} from 'react-router';
import {connect} from 'react-redux';


export const iconMapper = {
    TODO: <CarryOutOutlined/>,
    LEDGER: <AccountBookOutlined/>,
    NOTE: <FileTextOutlined/>
};

const getTree = (
    data: Project[],
    owner: string,
    index: number
): TreeNodeNormal[] => {
    let res = [] as TreeNodeNormal[];
    data.forEach((item: Project) => {
        const node = {} as TreeNodeNormal;
        if (item.subProjects && item.subProjects.length) {
            node.children = getTree(item.subProjects, owner, index);
        } else {
            node.children = [] as TreeNodeNormal[];
        }
        node.title = (
          <span style={{width: '100%'}}>
            {iconMapper[item.projectType]}&nbsp;{item.name}
          </span>
        );
        node.key = item.id.toString();
        res.push(node);
    });
    return res;
};

type ProjectProps = {
    id: number,
    ownerName: string,
    ownProjects: Project[];
    updateProjectRelations: (Projects: Project[]) => void;
};

const onDragEnter = (info: any) => {
    console.log(info.node)
    // expandedKeys 需要受控时设置
    // setState({
    //   expendKey: info.expandedKeys,
    // });
};

const findProjectById = (projects: Project[], projectId: number): Project => {
    let res = {} as Project;
    const searchProject = projects.find(item => item.id === projectId);
    if (searchProject) {
        res = searchProject;
    } else {
        for (let i = 0; i < projects.length; i++) {
            const searchSubProject = findProjectById(projects[i].subProjects, projectId);
            if (searchSubProject.id) {
                res = searchSubProject;
            }
        }
    }
    return res;
}

const dragProjectById = (projects: Project[], projectId: number): Project[] => {
    let res = [] as Project[];
    projects.forEach((item, index) => {
        let project = {} as Project;
        const subProjects = dragProjectById(item.subProjects, projectId);
        project = {...item, subProjects: subProjects};
        if (project.id !== projectId) res.push(project);
    })
    return res;
}

const DropProjectById = (projects: Project[], dropId: number, dropProject: Project): Project[] => {
    let res = [] as Project[];
    projects.forEach((item, index) => {
        let project = {} as Project;
        let subProjects = [] as Project[];
        if (item.id === dropId) {
            subProjects = item.subProjects;
            subProjects.push(dropProject);
        } else {
            subProjects = DropProjectById(item.subProjects, dropId, dropProject);
        }
        project = {...item, subProjects: subProjects}
        res.push(project);
    })
    return res;
}

const onDrop = (projects: Project[], updateProject: Function) => (info: any) => {
    const projectId = parseInt(info.dragNode.key)
    const targetProject = findProjectById(projects, projectId);
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    const droppingIndex = info.dropPosition + 1;
    const dragProjects = dragProjectById(projects, parseInt(info.dragNode.key));
    let resProjects = [] as Project[];
    if (dropPosition === -1) {
        const dragIndex = projects.findIndex(project => project.id === targetProject.id);
        if (dragIndex >= droppingIndex) {
            dragProjects.splice(droppingIndex, 0, targetProject);
            resProjects = dragProjects;
        } else {
            dragProjects.splice(droppingIndex - 1, 0, targetProject);
            resProjects = dragProjects;
        }
    } else {
        resProjects = DropProjectById(dragProjects, parseInt(info.node.key), targetProject);
    }
    updateProject(resProjects);
}

const onClick = (history: History<History.PoorMansUnknown>) => (e:any) => {
  if(e.length){
    history.push(`/projects/${e[0]}`)
  }
}


const OwnProject: React.FC<RouteComponentProps & ProjectProps> = props => {
    const {ownProjects, history, ownerName, id, updateProjectRelations} = props;
    const treeNode = getTree(ownProjects, ownerName, id);

    return (<div style={{marginLeft: '20%'}}><Tree
        className="ant-tree"
        draggable
        blockNode
        onDragEnter={onDragEnter}
        selectable={true}
        onSelect={onClick(history)}
        onDrop={onDrop(ownProjects, updateProjectRelations)}
        treeData={treeNode}/></div>);
}

export default connect(null, {updateProjectRelations})(
    withRouter(OwnProject)
);