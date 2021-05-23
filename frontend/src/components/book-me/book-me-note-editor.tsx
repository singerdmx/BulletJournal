import React, {useEffect, useRef, useState} from "react";

import './book-me.styles.less';
import {message, Tooltip} from "antd";
import {CheckCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined} from "@ant-design/icons";
import ReactQuill from "react-quill";
import {formats, modules} from "../content-editor/content-editor-toolbar";
import {DeltaStatic} from "quill";
import {setToolTips} from "../content-editor/content-editor.component";

type BookMeNoteEditorProps = {
    delta: DeltaStatic;
}

const BookMeNoteEditor: React.FC<BookMeNoteEditorProps> = (
    {
        delta
    }
) => {
    const quillRef = useRef<ReactQuill>(null);
    const [editorContent, setEditorContent] = useState({delta: delta});
    const [contentChanged, setContentChanged] = useState(false);
    const oldContents = delta;

    useEffect(() => {
        setToolTips();
    }, []);

    const handleOnClick = (save: boolean) => {
        if (save) {
        } else {
            console.log('oldContents', oldContents)
            setEditorContent({delta: oldContents});
        }
        setContentChanged(false);
    }

    const handleChange = (
        content: string,
        delta: any,
        source: any,
        editor: ReactQuill.UnprivilegedEditor
    ) => {
        setContentChanged(true);
        setEditorContent({
            delta: editor.getContents(),
        });
    };

    return <div className='note-editor'>
        <div className='note-editor-title'>
            Description/Instructions&nbsp;&nbsp;
            <Tooltip
                title="Use this optional field to provide a description of your event">
                                    <span className="question-icon">
                                    <QuestionCircleOutlined/>
                                </span>
            </Tooltip>
            <Tooltip placement="top" title='Save'>
                <CheckCircleOutlined
                    onClick={() => handleOnClick(true)}
                    style={{
                        marginLeft: '20px',
                        cursor: 'pointer',
                        color: '#00e600',
                        fontSize: 20,
                        visibility: contentChanged ? 'visible' : 'hidden'
                    }} />
            </Tooltip>
            <Tooltip placement="top" title='Cancel'>
                <CloseCircleOutlined
                    onClick={() => handleOnClick(false)}
                    style={{
                        marginLeft: '20px',
                        cursor: 'pointer',
                        color: '#ff0000',
                        fontSize: 20,
                        visibility: contentChanged ? 'visible' : 'hidden'
                    }} />
            </Tooltip>
        </div>
        <ReactQuill
            bounds={'.note-editor'}
            ref={quillRef}
            theme="snow"
            modules={modules}
            formats={formats}
            onChange={handleChange}
            style={{height: '70px'}}
            value={editorContent['delta']}
        />
    </div>
}

export default BookMeNoteEditor;