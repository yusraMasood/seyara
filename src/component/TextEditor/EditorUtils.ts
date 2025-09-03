import { Alert, Linking, Platform } from "react-native";
import { captureRef } from "react-native-view-shot";
import Share from "react-native-share";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import RNFS from "react-native-fs";
import { launchImageLibrary } from "react-native-image-picker";

export const injectFont = async (richRef: any) => {
  const fontPath =
    Platform.OS === "ios"
      ? `${RNFS.MainBundlePath}/JameelNooriNastaleeqKasheeda.ttf`
      : `file:///android_asset/fonts/JameelNooriNastaleeqKasheeda.ttf`;

  const css = `
    @font-face {
      font-family: 'Jameel';
      src: url('${fontPath}') format('truetype');
      font-weight: normal;
      font-style: normal;
    }
    body, p, span, div {
      font-family: 'Jameel';
    }
  `;

  richRef.current?.commandDOM(`
    (function() {
      var style = document.getElementById("custom-font-style");
      if (!style) {
        style = document.createElement('style');
        style.id = "custom-font-style";
        document.head.appendChild(style);
      }
      style.innerHTML = \`${css}\`;
    })();
  `);
};

export const saveAsImage = async (viewShotRef: any) => {
  try {
    const uri = await captureRef(viewShotRef, { format: "png", quality: 1 });
    await Share.open({ url: uri, type: "image/png" });
  } catch (e: any) {
    Alert.alert("Save Image failed", e?.message ?? String(e));
  }
};

export const createPdfWithHTML = async (html: string) => {
  try {
    const options = {
      html,
      fileName: `RichNote_${Date.now()}`,
      base64: false,
    } as const;

    const pdf = await RNHTMLtoPDF.convert(options);
    if (pdf?.filePath) {
      await Share.open({
        url: Platform.OS === "android" ? `file://${pdf.filePath}` : pdf.filePath,
        type: "application/pdf",
      });
    } else {
      Alert.alert("PDF not created");
    }
  } catch (e: any) {
    Alert.alert("Create PDF failed", e?.message ?? String(e));
  }
};


export const onInsertImage = async (richRef: any) => {
  try {
    const res = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.7,
      includeBase64: true,
      maxWidth: 1600,   // limit size to avoid super huge base64 strings
      maxHeight: 1600,
    });

    const asset = res?.assets?.[0];
    if (!asset) return;

    // 1) Network URL -> insert directly
    if (asset.uri?.startsWith('http')) {
      richRef.current?.insertImage(asset.uri, 'max-width:100%;height:auto;');
      return;
    }

    // 2) Base64 provided by picker -> insert data URI
    if (asset.base64 && asset.type) {
      const dataUri = `data:${asset.type};base64,${asset.base64}`;
      richRef.current?.insertImage(dataUri, 'max-width:100%;height:auto;');
      return;
    }

    // 3) content:// or other local uri -> copy to cache and try:
    let origUri = asset.uri;
    if (!origUri) throw new Error('No URI from picker');

    // For Android content:// URIs, copy to cache
    const destPath = `${RNFS.CachesDirectoryPath}/img_${Date.now()}.jpg`;
    try {
      // On Android content URIs, RNFS.copyFile may accept content uri depending on platform & lib versions.
      await RNFS.copyFile(origUri, destPath);
    } catch (copyErr) {
      // try reading directly if copy fails - some devices won't allow copy, we'll attempt read (some URIs need different handling)
      console.warn('copyFile failed, continuing to attempt read:', copyErr);
    }

    const fileUri = `file://${destPath}`;

    // Try inserting file:// first (fast). If WebView blocks file://, next step will try base64 fallback.
    try {
      richRef.current?.insertImage(fileUri, 'max-width:100%;height:auto;');
      // wait a fraction, then check the content HTML or let user verify
      return;
    } catch (e) {
      console.warn('insertImage(fileUri) possibly failed, will fallback to base64 read', e);
    }

    // As robust fallback, read file and insert base64
    try {
      const b64 = await RNFS.readFile(destPath, 'base64');
      const mime = asset.type || 'image/jpeg';
      const dataUri = `data:${mime};base64,${b64}`;
      richRef.current?.insertImage(dataUri, 'max-width:100%;height:auto;');
      return;
    } catch (readErr) {
      console.warn('readFile -> base64 failed', readErr);
      // last resort: if we have asset.uri that is a plain file path (not content://) try that
      if (origUri.startsWith('file://')) {
        richRef.current?.insertImage(origUri, 'max-width:100%;height:auto;');
        return;
      }
      throw readErr;
    }
  } catch (e: any) {
    Alert.alert('Insert Image failed', e?.message ?? String(e));
  }
};

export const onPressAddLink = (richRef: any) => {
  if (Platform.OS === "ios") {
    Alert.prompt("Insert Link", "Enter Title, URL", (input) => {
      const [title, url] = input.split(",").map((s) => s.trim());
      if (title && url) {
        richRef.current?.insertLink(title, url);
      } else {
        Alert.alert("Invalid input", "Please enter Title, URL");
      }
    });
  } else {
    Alert.alert("Insert Link", "Custom modal needed for Android.");
  }
};

export const onLinkPress = (url: string) => {
  Linking.openURL(url).catch(() => Alert.alert("Cannot open link", url));
};
