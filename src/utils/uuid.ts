// 短 ID 生成(用于历史记录主键)
// 使用 nanoid 短别名版本,16 字符
import { customAlphabet } from 'nanoid/non-secure';

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
const nano = customAlphabet(alphabet, 16);

export function genId(): string {
  return nano();
}
