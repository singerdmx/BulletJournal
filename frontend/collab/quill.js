/* eslint-env browser */

import * as Y from 'yjs'
import {QuillBinding} from 'y-quill'
import Quill from 'quill'
import QuillCursors from 'quill-cursors'
import {WebrtcProvider} from 'y-webrtc'
import * as Emoji from "quill-emoji";


Quill.register('modules/cursors', QuillCursors);

window.addEventListener('load', () => {
    var name = prompt("Please enter your name", 'unknown');
    console.log(name);

    const params = new URLSearchParams(window.location.search);
    const contentId = params.get('uid');
    fetch("http://localhost/api/public/collab/" + contentId).then(response => {
        console.log(response.json());
    }).catch(reason => {
            console.log(reason);
        }
    );


    const ydoc = new Y.Doc();
    const provider = new WebrtcProvider('your-room-name', ydoc, {signaling: ['ws://localhost:4444']});
    const type = ydoc.getText('quill');
    const editorContainer = document.createElement('div');
    editorContainer.setAttribute('id', 'editor');
    document.body.insertBefore(editorContainer, null);

    var editor = new Quill(editorContainer, {
        modules: {
            cursors: true,
            toolbar: [
                [
                    {header: [1, 2, 3, false]},
                    {color: []},
                    {background: []},
                    {align: []},
                ],
                ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block', 'undo', 'redo'],
                [
                    {list: 'ordered'},
                    {list: 'bullet'},
                    {indent: '-1'},
                    {indent: '+1'},
                ],

                ['link'],

                ['clean'],
            ],
            history: {
                userOnly: true
            },
        },
        placeholder: 'Start collaborating...',
        theme: 'snow' // or 'bubble'
    });

    const binding = new QuillBinding(type, editor, provider.awareness);

    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    console.log("color:" + randomColor);
    // Define user name and user name
    // Check the quill-cursors package on how to change the way cursors are rendered
    provider.awareness.setLocalStateField('user', {
      name: name,
      color: randomColor
    });



    // @ts-ignore
    window.example = {provider, ydoc, type, binding, Y}
});


const colors= ['aqua', 'black', 'blue', 'fuchsia', 'gray', 'green',
    'lime', 'maroon', 'navy', 'olive', 'orange', 'purple', 'red',
    'silver', 'teal', 'white', 'yellow'];
