import React from 'react';
import {EditorState, RichUtils, convertToRaw } from "draft-js";
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




  render() {
    const raw = convertToRaw(this.state.editorState.getCurrentContent())
    return (
    <div>
    <button onClick={()=> {this.makeBold()}}>Bold</button>
    <button onClick={()=> {this.makeItalic()}}>Italicize</button>
    <button onClick={()=> {this.makeUnderlined()}}>Underline</button>
    <button onClick={()=> {this.makeHighlighted()}}>Highlight</button>
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
