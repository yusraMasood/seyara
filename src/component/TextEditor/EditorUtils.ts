import { Alert, Linking, Platform } from "react-native";
import { captureRef } from "react-native-view-shot";
import Share from "react-native-share";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import RNFS from "react-native-fs";
import { launchImageLibrary } from "react-native-image-picker";

export const injectFont = async (richRef: any) => {
  const fontPath =
    Platform.OS === "ios"
      ? `${RNFS.MainBundlePath}/assets/fonts/JameelNooriNastaleeqKasheeda.ttf`
      : `file:///android_asset/fonts/JameelNooriNastaleeqKasheeda.ttf`;

  const css = `
    @font-face {
      font-family: 'Jameel';
      src: url('${fontPath}');
    }
    body, p, span, div {
      font-family: 'Jameel' !important;
    }
  `;

  richRef.current?.commandDOM(`
    var style = document.createElement('style');
    style.innerHTML = \`${css}\`;
    document.head.appendChild(style);
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
    const result = await launchImageLibrary({
      mediaType: "photo",
      quality: 0.7,
      includeBase64: true,
    });

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];

      if (asset.uri?.startsWith("file://")) {
        richRef.current?.insertImage(asset.uri, "");
        return;
      }

      if (asset.uri?.startsWith("content://")) {
        const destPath = `${RNFS.CachesDirectoryPath}/img_${Date.now()}.jpg`;
        await RNFS.copyFile(asset.uri, destPath);
        richRef.current?.insertImage(`file://${destPath}`, "");
        return;
      }

      if (asset.base64 && asset.type) {
        const base64Uri = `data:${asset.type};base64,${asset.base64}`;
        richRef.current?.insertImage(base64Uri, "");
        return;
      }
    }
  } catch (e: any) {
    Alert.alert("Image insert failed", e?.message ?? String(e));
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
