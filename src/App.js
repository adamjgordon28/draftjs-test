import React from 'react';
import {EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";
import Editor from 'draft-js-plugins-editor'
import createEmojiPlugin from 'draft-js-emoji-plugin';
import createHighlightPlugin from './highlightPlugin';
import 'draft-js-emoji-plugin/lib/plugin.css'
import './App.css';

const emojiPlugin = createEmojiPlugin();

const { EmojiSuggestions } = emojiPlugin;

const highlightPlugin = createHighlightPlugin({
  background: 'purple'
});

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editorState: EditorState.createEmpty()
    }
  }

  makeBold(){
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      'BOLD'
    ))
  }

  makeItalic(){
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      'ITALIC'
    ))
  }

  makeUnderlined(){
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      'UNDERLINE'
    ))
  }

  makeHighlighted(){
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      'HIGHLIGHT'
    ))
  }


  onChange =(editorState) => {
    this.setState({
      editorState: editorState
    })
  }

  handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);

    if (newState) {
      this.onChange(newState);
      return 'handled';
    }

    return 'not-handled';
  }


 createNote = (noteContent) => {
  fetch("http://localhost:4000/api/v1/entries", {
   method: "post",
   headers: { "Content-Type": "application/json", "Accepts": "application/json" },
   body: JSON.stringify({ content: JSON.stringify(noteContent) })
  })
   .then(response => response.json())
   .then(json => {
    console.log(json)
   })
}

getEntry= (entryId) => {
 fetch("http://localhost:4000/api/v1/entries/" + `${entryId}`)
  .then(response => response.json())
  .then(json => {
   this.setState({
     editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(json.content)))
   })

  })
}



  render() {
    const raw1 = convertToRaw(this.state.editorState.getCurrentContent())
    let raw2;
    let unraw
    return (
    <div>
    <button onClick={()=> {this.makeBold()}}>Bold</button>
    <button onClick={()=> {this.makeItalic()}}>Italicize</button>
    <button onClick={()=> {this.makeUnderlined()}}>Underline</button>
    <button onClick={()=> {this.makeHighlighted()}}>Highlight</button>
    <button onClick={()=> {raw2=raw1}}>Set Equal 1</button>
    <button onClick={()=> {console.log(raw2)}}>ConsoleLog Raw2</button>
    <button onClick={()=> {console.log(convertFromRaw(raw2))}}>Console Log ConvertFromRaw(Raw2)</button>
    <button onClick={()=> {unraw = convertFromRaw(raw2)}}>Set Equal 2</button>
    <button onClick={()=> {console.log(unraw)}}>Console Log Unraw</button>
    <button onClick={()=> {this.createNote(raw1)}}>Persist To Database</button>
    <button onClick={()=> {this.getEntry(10)}}>FetchAndUpdateState</button>
    <button onClick={()=> {this.setState({
      editorState: EditorState.createWithContent(unraw)
    })}}>UpdateState</button>

    <Editor
    onChange={(editorState) => {this.onChange(editorState)}}
    handleKeyCommand={this.handleKeyCommand}
    editorState={this.state.editorState}
    plugins={[highlightPlugin, emojiPlugin]}
    />
    <EmojiSuggestions />
    </div>
  )};

}

export default App;
