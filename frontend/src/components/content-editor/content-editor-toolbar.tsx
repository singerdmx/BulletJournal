import {Quill} from 'react-quill';
import quillEmoji from 'quill-emoji';
import 'quill-emoji/dist/quill-emoji.css';
import 'react-quill/dist/quill.snow.css';
import ImageResize from '../../utils/image-resize/ImageResize';
import ImageFormat from '../../utils/image-resize/ImageFormat';
import ImageDropAndPaste from '../../utils/image-drop-and-paste/quill-image-drop-and-paste';
import hljs from 'highlight.js'

Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/imageDropAndPaste', ImageDropAndPaste);
Quill.register(ImageFormat, true);

hljs.initHighlightingOnLoad();

// Custom Undo button çicon component for Quill editor. You can import it directly
// from 'quill/assets/icons/undo.svg' but I found that a number of loaders do not
// handle them correctly
// const CustomUndo = () => (
//   <svg viewBox="0 0 18 18">
//     <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
//     <path
//       className="ql-stroke"
//       d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
//     />
//   </svg>
// );

// // Redo button icon component for Quill editor
// const CustomRedo = () => (
//   <svg viewBox="0 0 18 18">
//     <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
//     <path
//       className="ql-stroke"
//       d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
//     />
//   </svg>
// );
// // Undo and redo functions for Custom Toolbar
// function undoChange(quillRef : ReactQuill) {
//   const editor = quillRef.getEditor();

//   editor.history.undo();
// }
// function redoChange(quillRef : ReactQuill) {
//   const editor = quillRef.getEditor();
//   editor.history.redo();
// }

// Add emojii to whitelist and register them
const { EmojiBlot, ShortNameEmoji, ToolbarEmoji, TextAreaEmoji } = quillEmoji;
Quill.register(
  {
    'formats/emoji': EmojiBlot,
    'modules/emoji-shortname': ShortNameEmoji,
    'modules/emoji-toolbar': ToolbarEmoji,
    'modules/emoji-textarea': TextAreaEmoji,
  },
  true
);

// Add sizes to whitelist and register them
const Size = Quill.import('formats/size');
Size.whitelist = ['small',  'large', 'huge'] ;
Quill.register(Size, true);

// Add fonts to whitelist and register them
const Font = Quill.import('formats/font');
Font.whitelist = ["sans-serif", "serif", "monospace"];
Quill.register(Font, true);

const icons = Quill.import("ui/icons");
icons["undo"] = `<svg viewbox="0 0 18 18">
    <polygon class="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10"></polygon>
    <path class="ql-stroke" d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"></path>
  </svg>`;
icons["redo"] = `<svg viewbox="0 0 18 18">
    <polygon class="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10"></polygon>
    <path class="ql-stroke" d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"></path>
  </svg>`;

export const readOnlyModules = {
  syntax: {
    highlight: (text: string) => hljs.highlightAuto(text).value,
  },
  toolbar: false
}

// Modules object for setting up the Quill editor
export const modules = {
  imageResize:{
    displaySize: true
  },
  syntax: {
    highlight: (text: string) => hljs.highlightAuto(text).value,
  },
  toolbar: {
    container: [
      ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block', 'undo', 'redo'],
      [
        {list: 'ordered'},
        {list: 'bullet'},
        {list: 'check'},
        {indent: '-1'},
        {indent: '+1'},
      ],

      ['link', 'image', 'emoji'],

      ['clean'],
      [
        {header: [1, 2, 3, false]},
        {font: ["sans-serif", "serif", "monospace"] },
        {size: ['small',  'large', 'huge'] },
        {color: []},
        {background: []},
        {align: []},
      ],
    ],
    handlers: {},
  },
  imageDropAndPaste: {},
  'emoji-toolbar': true,
  'emoji-shortname': true,
  'emoji-textarea': false,
  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true,
  },
};

export const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'align',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'emoji',
  'color',
  'background',
  'code-block',
  'width',
  'style',
  'height',
  'alt',
  'font',
  'size'

];

// // Quill Toolbar component
// export const QuillToolbar = () => (
//   <div id="toolbar">
//     <span className="ql-formats">
//       <select className="ql-font" defaultValue="arial">
//         <option value="arial">Arial</option>
//         <option value="comic-sans">Comic Sans</option>
//         <option value="courier-new">Courier New</option>
//         <option value="georgia">Georgia</option>
//         <option value="helvetica">Helvetica</option>
//         <option value="lucida">Lucida</option>
//       </select>
//       <select className="ql-size" defaultValue="medium">
//         <option value="extra-small">Size 1</option>
//         <option value="small">Size 2</option>
//         <option value="medium">Size 3</option>
//         <option value="large">Size 4</option>
//       </select>
//       <select className="ql-header" defaultValue="3">
//         <option value="1">Heading</option>
//         <option value="2">Subheading</option>
//         <option value="3">Normal</option>
//       </select>
//     </span>
//     <span className="ql-formats">
//       <button className="ql-bold" />
//       <button className="ql-italic" />
//       <button className="ql-underline" />
//       <button className="ql-strike" />
//     </span>
//     <span className="ql-formats">
//       <button className="ql-list" value="ordered" />
//       <button className="ql-list" value="bullet" />
//       <button className="ql-indent" value="-1" />
//       <button className="ql-indent" value="+1" />
//     </span>
//     <span className="ql-formats">
//       <button className="ql-script" value="super" />
//       <button className="ql-script" value="sub" />
//       <button className="ql-blockquote" />
//       <button className="ql-direction" />
//     </span>
//     <span className="ql-formats">
//       <select className="ql-align" />
//       <select className="ql-color" />
//       <select className="ql-background" />
//     </span>
//     <span className="ql-formats">
//       <button className="ql-link" />
//       <button className="ql-image" />
//       <button className="ql-emoji" />
//     </span>
//     <span className="ql-formats">
//       <button className="ql-code-block" />
//       <button className="ql-clean" />
//     </span>
//   </div>
// );
