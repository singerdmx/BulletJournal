import React, {useEffect, useRef, useState} from "react";

import './book-me.styles.less';
import {message, Tooltip} from "antd";
import {CheckCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined} from "@ant-design/icons";
import ReactQuill from "react-quill";
import {formats, modules} from "../content-editor/content-editor-toolbar";
import Quill, {DeltaStatic} from "quill";
import {setToolTips} from "../content-editor/content-editor.component";
import axios from "axios";
import placeholder from "../../assets/placeholder.png";

const Delta = Quill.import('delta');

type BookMeNoteEditorProps = {
    delta: DeltaStatic;
    saveContent: (delta: DeltaStatic) => void;
}

const BookMeNoteEditor: React.FC<BookMeNoteEditorProps> = (
    {
        delta,
        saveContent
    }
) => {
    const quillRef = useRef<ReactQuill>(null);
    const [editorContent, setEditorContent] = useState({delta: delta});
    const [contentChanged, setContentChanged] = useState(false);
    const [error, setError] = useState('');
    const oldContents = delta;

    useEffect(() => {
        setToolTips();
        if (error.length < 1) return;
        message.error(error);
        return () => {
            setError('');
        };
    }, [error]);

    const apiPostNewsImage = (formData: FormData) => {
        const uploadConfig = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };
        return axios.post('/api/uploadFile', formData, uploadConfig);
    };
    const imageUploader = () => {
        if (!quillRef) return;
        const editor = quillRef.current!.getEditor();
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        console.log('start upload');
        input.onchange = async () => {
            const file = input.files![0];
            const formData = new FormData();
            if (file.size > 20 * 1024 * 1024) {
                setError('The file can not be larger than 20MB');
                return;
            }

            if (!file.type.match('image.*')) {
                setError('The file can only be image');
                return;
            }

            formData.append('file', file);
            // Save current cursor state
            const range = editor.getSelection(true);
            editor.insertEmbed(range.index, 'image', `${placeholder}`);
            try {
                const res = await apiPostNewsImage(formData); // API post, returns image location as string e.g. 'http://www.example.com/images/foo.png'
                console.log("apiPostNewsImage", res)
                editor.deleteText(range.index, 1);
                const link = res.data;
                editor.insertEmbed(range.index, 'image', link);
                editor.setSelection(range.index + 1, 0);
            } catch (e) {
                console.log(e.response.data.message);
                setError(e.response.data.message);
            }
        };
    };
    const undoHistory = () => {
        if (!quillRef) return;
        const editor = quillRef.current!.getEditor();
        editor.getModule('history').undo();
    }
    const redoHistory = () => {
        if (!quillRef) return;
        const editor = quillRef.current!.getEditor();
        editor.getModule('history').redo();
    }
    modules.toolbar.handlers = {
        image: imageUploader,
        undo: undoHistory,
        redo: redoHistory
    };

    /**
     * Do something to our dropped or pasted image
     * @param.imageDataUrl {string} - image's dataURL
     * @param.type {string} - image's mime type
     * @param.imageData {object} - provided more functions to handle the image
     *   - imageData.toBlob() {function} - convert image to a BLOB Object
     *   - imageData.toFile(filename) {function} - convert image to a File Object
     *   - imageData.minify(options) {function)- minify the image, return a promise
     *      - options.maxWidth {number} - specify the max width of the image, default is 800
     *      - options.maxHeight {number} - specify the max height of the image, default is 800
     *      - options.quality {number} - specify the quality of the image, default is 0.8
     */
    const imageDropAndPasteHandler = (imageDataUrl: string, type: string, imageData: any) => {
        if (!quillRef) return;
        const editor = quillRef.current!.getEditor();
        let extension = 'png';
        if (type.startsWith('image/')) {
            extension = type.substring(6);
        }
        const filename = `copied_image.${extension}`;
        const file = imageData.toFile(filename)

        if (file.size > 20 * 1024 * 1024) {
            setError('The file can not be larger than 20MB');
            return;
        }

        // generate a form data
        const formData = new FormData()

        // or just append the file
        formData.append('file', file);

        // Save current cursor state
        const range = editor.getSelection(true);
        editor.insertEmbed(range.index, 'image', `${placeholder}`);
        try {
            apiPostNewsImage(formData).then(res => {
                // API post, returns image location as string e.g. 'http://www.example.com/images/foo.png'
                editor.deleteText(range.index, 1);
                const link = res.data;
                editor.insertEmbed(range.index, 'image', link);
                editor.setSelection(range.index + 1, 0);
            });
        } catch (e) {
            console.log(e.response.data.message);
            setError(e.response.data.message);
        }
    }

    modules.imageDropAndPaste = {handler: imageDropAndPasteHandler};

    const handleOnClick = () => {
        setContentChanged(false);
        const newContent : DeltaStatic = new Delta(editorContent['delta']);
        saveContent(newContent);
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
                    onClick={() => handleOnClick()}
                    style={{
                        marginLeft: '20px',
                        cursor: 'pointer',
                        color: '#00e600',
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
        />
    </div>
}

export default BookMeNoteEditor;