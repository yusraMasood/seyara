import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import ViewShot from "react-native-view-shot";
import { colors, themeShadow } from "../../utils/appTheme";
import { vh, vw } from "../../utils/dimensions";

import { BUTTON } from "./Buttons";
import { toolbarActions } from "./ToolbarConfig";
import {
  injectFont,
  saveAsImage,
  createPdfWithHTML,
  onInsertImage,
  onPressAddLink,
  onLinkPress,
} from "./EditorUtils";
import ColorPickerModal from "../Modals/ColorPicker";
import FontPickerModal from "../Modals/FontpickerModal";

export default function RichTextEditorScreen() {
  const [selectedColor, setSelectedColor] = useState("#111");
  const [fontModalVisible, setFontModalVisible] = useState(false);
  const [colorModalVisible, setColorModalVisible] = useState(false);
  const [selectedFont, setSelectedFont] = useState("Jameel");

  const richRef = useRef<any>(null);
  const viewShotRef = useRef<any>(null);
  const [html, setHtml] = useState("<p><br/></p>");

  useEffect(() => {
    injectFont(richRef);
  }, []);

  const onSetTextColor = useCallback((color: string) => {
    setSelectedColor(color);
    richRef.current?.setForeColor(color);
    richRef.current?.focusContentEditor();
    setColorModalVisible(false);
  }, []);

  const onSetFontFamily = useCallback((fontName: string) => {
    setSelectedFont(fontName);
    richRef.current?.commandDOM(`
      document.execCommand('styleWithCSS', false, true);
      document.execCommand('fontName', false, '${fontName}');
    `);
    richRef.current?.focusContentEditor();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Seyara</Text>
        </View>

        <View style={styles.toolbarWrapper}>
          <RichToolbar
            editor={richRef}
            actions={toolbarActions}
            onPressAddImage={() => onInsertImage(richRef)}
            onInsertLink={() => onPressAddLink(richRef)}
            selectedIconTint="#111"
            iconTint="#6b7280"
            iconSize={vw * 5}
            style={styles.toolbar}
            iconMap={{
              customAction: () => (
                <View
                  key={selectedColor}
                  style={[styles.colorIcon, { backgroundColor: selectedColor }]}
                />
              ),
              fontFamily: () => (
                <Text style={{ fontFamily: selectedFont, fontSize: vw * 4 }}>F</Text>
              ),
            }}
            fontFamily={() => setFontModalVisible(true)}
            customAction={() => setColorModalVisible(true)}
            fontSize={() => setFontModalVisible(true)}
          />
        </View>

        <ViewShot ref={viewShotRef} style={styles.editorCard}>
          <RichEditor
            key={selectedFont}
            ref={richRef}
            style={styles.editor}
            placeholder="Start typing…"
            initialContentHTML={html}
            editorStyle={{
              backgroundColor: colors.white,
              color: colors.black,
              placeholderColor: "#9aa3ac",
              contentCSSText: `
                font-size:16px;
                line-height:1.5;
                font-family: '${selectedFont}', sans-serif !important;
                padding:12px;
                height:${vh * 50}px;
                background-color:${colors.white};
                color:${colors.black};
              `,
            }}
            onChange={setHtml}
            onLink={onLinkPress}
          />
        </ViewShot>

        <View style={styles.row}>
          <BUTTON label="Save as PNG" onPress={() => saveAsImage(viewShotRef)} />
          <BUTTON label="Save as PDF" onPress={() => createPdfWithHTML(html)} />
        </View>

        <ColorPickerModal
          visible={colorModalVisible}
          onClose={() => setColorModalVisible(false)}
          onSelectColor={onSetTextColor}
        />
        <FontPickerModal
          visible={fontModalVisible}
          onClose={() => setFontModalVisible(false)}
          onSelectFont={onSetFontFamily}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  title: { fontSize: 20, fontWeight: "700", color: "#111" },
  editorCard: {
    marginHorizontal: vw * 5,
    marginTop: vh * 2,
    borderRadius: 16,
    overflow: "hidden",
    ...themeShadow,
  },
  editor: { minHeight: vh * 50 },
  toolbar: { backgroundColor: colors.white },
  row: {
    flexDirection: "row",
    gap: vw * 3,
    paddingHorizontal: vw * 8,
    paddingTop: vh * 2,
  },
  toolbarWrapper: {
    marginTop: vh * 1.2,
    marginHorizontal: vw * 3,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: vh * 0.8,
    paddingHorizontal: vw * 1,
    ...themeShadow,
  },
  colorIcon: {
    width: vw * 5,
    height: vw * 5,
    borderRadius: vw * 2.5,
    borderWidth: 1,
    borderColor: colors.black,
  },
});
