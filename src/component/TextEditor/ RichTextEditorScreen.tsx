import React from "react";
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
import { saveAsImage, createPdfWithHTML, onInsertImage, onPressAddLink, onLinkPress } from "./EditorUtils";
import ColorPickerModal from "../Modals/ColorPicker";
import FontPickerModal from "../Modals/FontpickerModal";
import FontSizePickerModal from "../Modals/FontSizeModal";
import { useRichTextController } from "./useRichTextController";

export default function RichTextEditorScreen() {
  const ctrl = useRichTextController();

  return (
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Seyara</Text>
        </View>

        {/* Toolbar */}
        <View style={styles.toolbarWrapper}>
          <RichToolbar
            editor={ctrl.richRef}
            actions={toolbarActions}
            onPressAddImage={() => onInsertImage(ctrl.richRef)}
            onInsertLink={() => onPressAddLink(ctrl.richRef)}
            selectedIconTint="#111"
            iconTint="#6b7280"
            iconSize={vw * 5}
            style={styles.toolbar}
            iconMap={{
              customAction: () => (
                <View style={[styles.colorIcon, { backgroundColor: ctrl.selectedColor }]} />
              ),
              fontFamily: () => (
                <Text style={{ fontFamily: ctrl.selectedFont, fontSize: vw * 4 }}>F</Text>
              ),
              fontSize: () => (
                <Text style={{ fontSize: vw * 4, fontWeight: "600" }}>{ctrl.selectedFontSize}</Text>
              ),
            }}
            fontFamily={() => ctrl.toggleModal("font", true)}
            customAction={() => ctrl.toggleModal("color", true)}
            fontSize={() => ctrl.toggleModal("fontSize", true)}
          />
        </View>

        {/* Editor */}
        <ViewShot ref={ctrl.viewShotRef} style={styles.editorCard}>
          <RichEditor
            ref={ctrl.richRef}
            style={styles.editor}
            placeholder="Start typing…"
            initialContentHTML={ctrl.html}
            editorStyle={{
              contentCSSText: `
      font-family: '${ctrl.selectedFont}', sans-serif;
      font-size: ${ctrl.selectedFontSize}px;
      line-height: 1.5;
    `,
              backgroundColor: colors.white,
              color: colors.black,
              placeholderColor: "#9aa3ac",
            }}
            onChange={ctrl.setHtml}
            onLink={onLinkPress}
          />
        </ViewShot>

        {/* Save Buttons */}
        <View style={styles.row}>
          <BUTTON label="Save as PNG" onPress={() => saveAsImage(ctrl.viewShotRef)} />
          <BUTTON label="Save as PDF" onPress={() => createPdfWithHTML(ctrl.html)} />
        </View>
      </ScrollView>
      {/* Modals */}
      <ColorPickerModal
        visible={ctrl.modals.color}
        onClose={() => ctrl.toggleModal("color", false)}
        onSelectColor={ctrl.onSetTextColor}
      />
      <FontPickerModal
        visible={ctrl.modals.font}
        onClose={() => ctrl.toggleModal("font", false)}
        onSelectFont={ctrl.onSetFontFamily}
      />
      <FontSizePickerModal
        visible={ctrl.modals.fontSize}
        onClose={() => ctrl.toggleModal("fontSize", false)}
        onSelectSize={ctrl.onSetFontSize}
      />

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
  editor: { minHeight: vh * 100 },
  toolbar: { backgroundColor: colors.white },
  row: {
    flexDirection: "row",
    gap: vw * 3,
    paddingHorizontal: vw * 8,
    paddingTop: vh * 2,
    marginBottom: vh * 40
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
