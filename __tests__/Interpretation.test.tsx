import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Interpretation } from '../src/components/Interpretation';

async function renderJSON(element: React.ReactElement): Promise<string> {
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(element);
  });
  return JSON.stringify(tree!.toJSON());
}

describe('Interpretation', () => {
  it('展示牌名、位置、正位与关键词', async () => {
    const json = await renderJSON(
      <Interpretation
        drawn={[{ cardId: 'major-00', orientation: 'upright', position: '现在' }]}
      />,
    );
    expect(json).toContain('愚者');
    expect(json).toContain('现在');
    expect(json).toContain('正位');
    expect(json).toContain('新开始'); // 正位关键词之一
  });

  it('逆位时展示逆位关键词', async () => {
    const json = await renderJSON(
      <Interpretation drawn={[{ cardId: 'major-00', orientation: 'reversed' }]} />,
    );
    expect(json).toContain('逆位');
    expect(json).toContain('鲁莽'); // 逆位关键词之一
  });
});
