

import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import ViewShot, { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { vh, vw } from '../utils/dimensions';
import { colors, themeShadow } from '../utils/appTheme';
import ColorPickerModal from './Modals/ColorPicker';
import { launchImageLibrary } from 'react-native-image-picker';

const BUTTON = ({ label, onPress }: { label: string; onPress: () => void }) => (
  <TouchableOpacity style={styles.btn} onPress={onPress}>
    <Text style={styles.btnText}>{label}</Text>
  </TouchableOpacity>
);

export default function RichTextEditorScreen() {
  const [selectedColor, setSelectedColor] = useState('#111');
  const richRef = useRef<RichEditor>(null);
  const viewShotRef = useRef<ViewShot>(null);
  const [colorModalVisible, setColorModalVisible] = useState(false);

  const [html, setHtml] = useState<string>("<p><br/></p>");

  const onSetTextColor = useCallback((color: string) => {
    setSelectedColor(color);

    richRef.current?.setForeColor(color); // reliable method
    richRef.current?.focusContentEditor();
    setColorModalVisible(false);
  }, []);

  // Toolbar actions (covering all built-in defaults from the docs)
  const toolbarActions = useMemo(
    () => [
      actions.undo,
      actions.redo,
      actions.setBold,
      actions.setItalic,
      actions.setUnderline,
      actions.setStrikethrough,
      actions.insertBulletsList,
      actions.insertOrderedList,
      actions.insertLink,
      actions.checkboxList,
      actions.insertImage,
      actions.removeFormat,
      actions.keyboard,
      "customAction",
    ],
    []
  );

  //const onInsertImage = useCallback(async () => {
  //  // Demo: insert an image by URL. Replace with your image picker.
  //  const demoUrl = 'https://picsum.photos/600/300';
  //  richRef.current?.insertImage(demoUrl, 'max-width:100%; height:auto;');
  //}, []);

  const onInsertVideo = useCallback(() => {
    const demoVideo = 'https://www.w3schools.com/html/mov_bbb.mp4';
    richRef.current?.insertVideo(demoVideo, 'max-width:100%;');
  }, []);

  //const onPressAddLink = useCallback(() => {
  //  // Simple example: prompt-like behavior with defaults
  //  const title = 'OpenAI';
  //  const url = 'https://openai.com';
  //  richRef.current?.insertLink(title, url);
  //}, []);
  const onPressAddLink = useCallback(() => {
    if (Platform.OS === 'ios') {
      Alert.prompt(
        'Insert Link',
        'Enter a title and URL separated by a comma (e.g. OpenAI, https://openai.com)',
        (input) => {
          const [title, url] = input.split(',').map((s) => s.trim());
          if (title && url) {
            richRef.current?.insertLink(title, url);
          } else {
            Alert.alert('Invalid input', 'Please enter "Title, URL"');
          }
        }
      );
    } else {
      // For Android → fallback modal since Alert.prompt doesn’t exist
      Alert.alert('Insert Link', 'This feature requires a custom modal on Android.');
    }
  }, []);

  const onLinkPress = useCallback((url: string) => {
    Linking.openURL(url).catch(() => Alert.alert('Cannot open link', url));
  }, []);

  // ----- Export: PNG Image via ViewShot -----
  const saveAsImage = useCallback(async () => {
    try {
      const uri = await captureRef(viewShotRef, {
        format: 'png',
        quality: 1,
      });
      await Share.open({ url: uri, type: 'image/png' });
    } catch (e: any) {
      Alert.alert('Save Image failed', e?.message ?? String(e));
    }
  }, []);

  // ----- Export: PDF from current HTML -----
  const createPdfWithHTML = useCallback(async () => {
    try {
      // BARE RN VERSION (react-native-html-to-pdf)
      const options = {
        html,
        fileName: `RichNote_${Date.now()}`,
        base64: false,
        // NOTE: choose directory options carefully on Android 10+
      } as const;
      const pdf = await RNHTMLtoPDF.convert(options);
      if (pdf?.filePath) {
        await Share.open({ url: Platform.OS === 'android' ? `file://${pdf.filePath}` : pdf.filePath, type: 'application/pdf' });
      } else {
        Alert.alert('PDF not created');
      }
    } catch (e: any) {
      Alert.alert('Create PDF failed', e?.message ?? String(e));
    }
  }, [html]);
  const onInsertImage = useCallback(async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
      });

      if (result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        if (uri) {
          richRef.current?.insertImage(uri, 'max-width:100%; height:auto;');
        }
      }
    } catch (e: any) {
      Alert.alert('Image insert failed', e?.message ?? String(e));
    }
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 0 })}
      >
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Seyara</Text>
          </View>

          {/* Wrap editor in ViewShot so we can export an image of the content area */}
          <ViewShot ref={viewShotRef} style={styles.editorCard} options={{ format: 'png', quality: 1 }}>
            <RichEditor
              ref={richRef}
              style={styles.editor}
              useContainer // keep default so it manages its own container height nicely
              placeholder="Start typing…"
              initialContentHTML={html}
              editorInitializedCallback={() => {
                // You can programmatically focus or insert content here
              }}
              editorStyle={{
                backgroundColor: colors.white,   // editor background
                color: colors.black,             // font color
                placeholderColor: '#9aa3ac',
                contentCSSText: `
                  font-size:16px; 
                  line-height:1.5; 
                  padding:12px; 
                  height:${vh * 50}px;       /* <- force internal editor height */
                  background-color:${colors.white};
                  color:${colors.black};
                `,
              }}

              onChange={(val) => setHtml(val)}
              onLink={onLinkPress}

              pasteAsPlainText={false}
            />
          </ViewShot>
          <View style={styles.toolbarWrapper}>
            <RichToolbar
              editor={richRef}
              actions={toolbarActions}
              onPressAddImage={onInsertImage}
              onInsertLink={onPressAddLink}
              selectedIconTint="#111"
              iconTint="#6b7280"
              iconSize={vw * 5}
              style={styles.toolbar}
              iconMap={{
                customAction: () => (
                  <View key={selectedColor} style={[styles.colorIcon, { backgroundColor: selectedColor }]} />
                ),
              }}
              customAction={() => {
                setColorModalVisible(true);
              }}
            />
          </View>

          <View style={styles.row}>
            <BUTTON label="Save as PNG" onPress={saveAsImage} />
            <BUTTON label="Save as PDF" onPress={createPdfWithHTML} />
          </View>
          <ColorPickerModal
            visible={colorModalVisible}
            onClose={() => setColorModalVisible(false)}
            onSelectColor={onSetTextColor}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f6f7f9',
    marginTop: vh * 4,
  },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  title: { fontSize: 20, fontWeight: '700', color: '#111' },
  caption: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  editorCard: {
    marginHorizontal: vw * 5,
    marginTop: vh * 2,
    borderRadius: 16,
    overflow: 'hidden',
    ...themeShadow,
  },
  editor: { minHeight: vh * 50, },
  toolbar: {
    backgroundColor: colors.white,
  },
  row: {
    flexDirection: 'row',
    gap: vw * 3,
    paddingHorizontal: vw * 8,
    paddingTop: vh * 2,
  },
  btn: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: vh * 1.5,
    paddingHorizontal: vw * 4,
  },
  btnText: { color: 'white', fontWeight: '600' },
  toolbarWrapper: {
    marginTop: vh * 1.2,
    marginHorizontal: vw * 3,
    flexWrap: 'wrap',
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    ...themeShadow,
  },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  colorOption: {
    width: vw * 12,
    height: vw * 12,
    borderRadius: vw * 6,
    margin: vw * 2,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  gradientOption: {
    width: vw * 30,
    height: vh * 6,
    borderRadius: 8,
    margin: vw * 2,
  },
});

