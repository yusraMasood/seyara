import { useState, useRef, useEffect, useCallback } from "react";
import { injectFont } from "./EditorUtils";

export const useRichTextController = () => {
  const richRef = useRef<any>(null);
  const viewShotRef = useRef<any>(null);

  const [html, setHtml] = useState("<p><br/></p>");
  const [selectedColor, setSelectedColor] = useState("#111");
  const [selectedFont, setSelectedFont] = useState("Jameel");
  const [selectedFontSize, setSelectedFontSize] = useState(16);

  const [modals, setModals] = useState({
    font: false,
    color: false,
    fontSize: false,
  });

  useEffect(() => {
    injectFont(richRef);
  }, []);

  const toggleModal = useCallback((key: "font" | "color" | "fontSize", visible: boolean) => {
    setModals((prev) => ({ ...prev, [key]: visible }));
  }, []);

  const wrapSelectionWithStyle = useCallback((style: string) => {
    richRef.current?.commandDOM(`
      (function(){
        var sel = window.getSelection && window.getSelection();
        if (!sel || !sel.rangeCount) return;
        var range = sel.getRangeAt(0);
        var wrapper = document.createElement('span');
        wrapper.setAttribute('style', ${JSON.stringify(style)});
        var contents = range.extractContents();
        wrapper.appendChild(contents);
        range.insertNode(wrapper);
        range.setStartAfter(wrapper);
        range.setEndAfter(wrapper);
        sel.removeAllRanges();
        sel.addRange(range);
      })();
    `);
    richRef.current?.focusContentEditor();
  }, []);

  const onSetTextColor = useCallback((color: string) => {
    setSelectedColor(color);
    richRef.current?.setForeColor(color);
    richRef.current?.focusContentEditor();
    toggleModal("color", false);
  }, [toggleModal]);

  const onSetFontFamily = useCallback((font: string) => {
    setSelectedFont(font);
    wrapSelectionWithStyle(`font-family: '${font}', sans-serif;`);
  }, [wrapSelectionWithStyle]);

  const onSetFontSize = useCallback((size: number) => {
    setSelectedFontSize(size);
    wrapSelectionWithStyle(`font-size: ${size}px;`);
  }, [wrapSelectionWithStyle]);

  return {
    richRef,
    viewShotRef,
    html,
    setHtml,
    selectedColor,
    selectedFont,
    selectedFontSize,
    modals,
    toggleModal,
    onSetTextColor,
    onSetFontFamily,
    onSetFontSize,
  };
};
