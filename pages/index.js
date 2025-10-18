import { useState, useRef } from 'react';
import { KnitPattern, types, Stitch } from '@/_lib/pattern';

// state is the typed pattern
export default function RendererContainer() {
  // UI state variable
  // the pattern is an object of Pattern class
  const [pattern, setPattern] = useState(new KnitPattern());


  function handleNewPatternText(text) {
    console.log(text);
    pattern.parseTextPattern(text);
    const updatedPattern = pattern.clone();
    setPattern(updatedPattern);
  }

  return (
    <>
      <PatternEditor handleSubmit={handleNewPatternText} />
      <Rendering pattern={pattern} />
    </>
  );
}

// a textbox that accepts the typed out pattern
// contains a button that triggers the pattern to be sent back
// up to the Renderer where it becomes changed into the state.
function PatternEditor({ handleSubmit }) {
  const patternTextEditor = useRef(null);

  function onSubmit() {
    const intermText = patternTextEditor.current.value;
    handleSubmit(intermText);
  }

  return (
    <div id="patternEditor">
      <textarea
        id="editorTextbox"
        rows="20"
        cols="20"
        placeholder="type your pattern here."
        ref={patternTextEditor}
      ></textarea>
      <button id="patternSubmit" onClick={onSubmit}>Submit Pattern</button>
    </div>
  );
}

// a box which takes the pattern object from state (parsed and cleaned pattern)
// and turns it into a series of images.
function Rendering({ pattern }) {
  return <div>{pattern.render()}</div>
}
