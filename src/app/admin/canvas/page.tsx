'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RenderDoc } from '@/cms/render';
import type { Doc } from '@/cms/schema';
import { canPlace, findBlock, type Position } from '@/cms/tree';
import { WIDGET_MAP } from '@/cms/widgetDefs';
import { newBlock } from '@/cms/tree';

/**
 * The editor canvas. It renders the real site components from the page document
 * it receives by postMessage from the editor shell, and reports clicks and drops
 * back. Because it is a real iframe, the tablet/mobile previews use true media
 * queries.
 */
type Drop = { id: string | null; position: Position } | null;

export default function Canvas() {
  const [doc, setDoc] = useState<Doc>({ version: 1, blocks: [] });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [drop, setDrop] = useState<Drop>(null);
  const docRef = useRef(doc);
  docRef.current = doc;

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const m = e.data;
      if (m?.type === 'state') {
        setDoc(m.doc);
        setSelectedId(m.selectedId ?? null);
      }
    };
    // Keyboard focus lives in this iframe after a click, so forward the editor shortcuts to the shell.
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod || e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        window.parent.postMessage({ type: 'key', key: e.key, ctrlKey: e.ctrlKey, metaKey: e.metaKey, shiftKey: e.shiftKey }, window.location.origin);
      }
    };
    window.addEventListener('message', onMessage);
    window.addEventListener('keydown', onKey);
    window.parent.postMessage({ type: 'ready' }, window.location.origin);
    return () => {
      window.removeEventListener('message', onMessage);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const send = useCallback((msg: unknown) => window.parent.postMessage(msg, window.location.origin), []);
  const blockOf = (t: EventTarget | null) => (t as HTMLElement | null)?.closest?.('[data-block-id]') as HTMLElement | null;

  const dragInfo = (e: React.DragEvent) => {
    const types = Array.from(e.dataTransfer.types);
    if (types.includes('application/x-vz-widget')) return { kind: 'widget' as const };
    if (types.includes('application/x-vz-block')) return { kind: 'block' as const };
    return null;
  };

  const computeDrop = (e: React.DragEvent): Drop => {
    const el = blockOf(e.target);
    if (!el) return { id: null, position: 'after' };
    const id = el.dataset.blockId!;
    const type = el.dataset.blockType!;
    const r = el.getBoundingClientRect();
    const y = (e.clientY - r.top) / Math.max(1, r.height);
    const isContainer = Boolean(WIDGET_MAP[type]?.container);
    const position: Position = isContainer && y > 0.25 && y < 0.75 ? 'inside' : y < 0.5 ? 'before' : 'after';
    return { id, position };
  };

  const styleSheet = useMemo(() => {
    const rules: string[] = [
      '[data-block-id]{cursor:pointer}',
      '.vz-end{margin:24px;padding:28px;border:2px dashed #cfd8d4;border-radius:12px;text-align:center;color:#6b7a75;font:14px system-ui}',
      '*{scroll-behavior:auto!important}',
    ];
    if (hoverId) rules.push(`[data-block-id="${hoverId}"]{outline:2px dashed #FFB107;outline-offset:-2px}`);
    if (selectedId) rules.push(`[data-block-id="${selectedId}"]{outline:3px solid #0A7A5F!important;outline-offset:-3px}`);
    if (drop?.id) {
      const shadow = drop.position === 'before' ? '0 -4px 0 0 #FFB107' : drop.position === 'after' ? '0 4px 0 0 #FFB107' : 'inset 0 0 0 4px #FFB107';
      rules.push(`[data-block-id="${drop.id}"]{box-shadow:${shadow}!important;position:relative;z-index:5}`);
    }
    return rules.join('\n');
  }, [hoverId, selectedId, drop]);

  const wrap = useCallback(
    (block: { id: string }, node: React.ReactElement): React.ReactNode =>
      (
        // Re-create the wrapper with drag behaviour; the original element carries the data attributes and CSS class.
        <NodeDraggable key={block.id} id={block.id} node={node} />
      ),
    [],
  );

  return (
    <div
      onClickCapture={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const el = blockOf(e.target);
        send({ type: 'select', id: el?.dataset.blockId ?? null });
      }}
      onMouseOver={(e) => setHoverId(blockOf(e.target)?.dataset.blockId ?? null)}
      onMouseLeave={() => setHoverId(null)}
      onDragOver={(e) => {
        if (!dragInfo(e)) return;
        e.preventDefault();
        setDrop(computeDrop(e));
      }}
      onDragLeave={(e) => {
        if (e.currentTarget === e.target) setDrop(null);
      }}
      onDrop={(e) => {
        const info = dragInfo(e);
        if (!info) return;
        e.preventDefault();
        const d = computeDrop(e);
        setDrop(null);
        const widget = e.dataTransfer.getData('application/x-vz-widget');
        const blockId = e.dataTransfer.getData('application/x-vz-block');
        // Validate here for instant feedback; the shell validates again.
        if (info.kind === 'block') {
          const b = findBlock(docRef.current.blocks, blockId);
          if (!b || !canPlace(docRef.current, b, d?.id ?? null, d?.position ?? 'after')) return;
        } else if (!canPlace(docRef.current, newBlock(widget), d?.id ?? null, d?.position ?? 'after')) return;
        send({ type: 'drop', kind: info.kind, widget, blockId, targetId: d?.id ?? null, position: d?.position ?? 'after' });
      }}
      style={{ minHeight: '100vh' }}
    >
      <style dangerouslySetInnerHTML={{ __html: styleSheet }} />
      {doc.blocks.length === 0 ? (
        <div className="vz-end" data-empty>
          This page is empty. Drag a widget here, or click one in the left panel.
        </div>
      ) : (
        <RenderDoc doc={doc} wrap={wrap as never} />
      )}
      <div className="vz-end">Drop here to add to the end of the page</div>
    </div>
  );
}

/** Makes a rendered block draggable (to reorder) without changing its markup. */
function NodeDraggable({ id, node }: { id: string; node: React.ReactElement }) {
  const el = node as React.ReactElement<Record<string, unknown>>;
  return (
    <el.type
      {...el.props}
      draggable
      onDragStart={(ev: React.DragEvent) => {
        ev.stopPropagation();
        ev.dataTransfer.setData('application/x-vz-block', id);
        ev.dataTransfer.effectAllowed = 'move';
      }}
    />
  );
}
