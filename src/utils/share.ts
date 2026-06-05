// 复制 / 分享解读文本。
// 优先写入系统剪贴板(@react-native-clipboard/clipboard,需 npm install + 重新构建原生);
// 若原生模块尚未就绪,自动降级到系统分享面板(Share 为 RN 内置,无需额外依赖)。
import { Share } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

export type DeliverResult = 'copied' | 'shared' | 'cancelled';

/** 一键复制:成功返回 'copied';原生剪贴板不可用时回退到分享。 */
export async function copyText(text: string): Promise<DeliverResult> {
  try {
    Clipboard.setString(text);
    return 'copied';
  } catch {
    return shareText(text);
  }
}

/** 唤起系统分享面板,可直接发送到任意 App(含各类 AI App)。 */
export async function shareText(text: string): Promise<DeliverResult> {
  try {
    const result = await Share.share({ message: text });
    return result.action === Share.dismissedAction ? 'cancelled' : 'shared';
  } catch {
    return 'cancelled';
  }
}
