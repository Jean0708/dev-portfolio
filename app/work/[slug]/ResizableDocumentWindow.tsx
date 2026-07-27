"use client";

import {
  ArrowsOutSimple,
  FilePdf,
  ImageSquare,
  Minus,
  Square,
  X,
} from "@phosphor-icons/react";
import Link from "next/link";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useRef,
  useState,
} from "react";

type ResizableDocumentWindowProps = {
  document?: string;
  image: string;
  title: string;
};

export function ResizableDocumentWindow({
  document,
  image,
  title,
}: ResizableDocumentWindowProps) {
  const windowRef = useRef<HTMLElement>(null);
  const resizeState = useRef<{
    pointerId: number;
    startHeight: number;
    startWidth: number;
    startX: number;
    startY: number;
  } | null>(null);
  const dragState = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    windowX: number;
    windowY: number;
  } | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [manualSize, setManualSize] = useState<{
    height?: number;
    width?: number;
  }>({});
  const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 });

  const clampWindowPosition = (x: number, y: number) => {
    const frame = windowRef.current;
    const stage = frame?.parentElement;
    if (!frame || !stage) return { x, y };

    const stageBounds = stage.getBoundingClientRect();
    const frameBounds = frame.getBoundingClientRect();
    const horizontalRoom =
      Math.max(24, (stageBounds.width - frameBounds.width) / 2) +
      stageBounds.width * 0.1;

    return {
      x: Math.min(horizontalRoom, Math.max(-horizontalRoom, x)),
      y: Math.min(180, Math.max(-120, y)),
    };
  };

  const startMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      isMaximized ||
      (event.target as HTMLElement).closest("button, a")
    ) {
      return;
    }

    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      windowX: windowPosition.x,
      windowY: windowPosition.y,
    };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const moveWindow = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = dragState.current;
    if (!state || state.pointerId !== event.pointerId) return;
    setWindowPosition(
      clampWindowPosition(
        state.windowX + event.clientX - state.startX,
        state.windowY + event.clientY - state.startY,
      ),
    );
  };

  const stopMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragState.current?.pointerId !== event.pointerId) return;
    dragState.current = null;
    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const moveWithKeyboard = (
    event: ReactKeyboardEvent<HTMLDivElement>,
  ) => {
    if (
      isMaximized ||
      !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
    ) {
      return;
    }

    const step = event.shiftKey ? 40 : 16;
    setWindowPosition((current) =>
      clampWindowPosition(
        current.x +
          (event.key === "ArrowLeft"
            ? -step
            : event.key === "ArrowRight"
              ? step
              : 0),
        current.y +
          (event.key === "ArrowUp"
            ? -step
            : event.key === "ArrowDown"
              ? step
              : 0),
      ),
    );
    event.preventDefault();
  };

  const startResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const frame = windowRef.current;
    if (!frame || isMaximized) return;

    const bounds = frame.getBoundingClientRect();
    resizeState.current = {
      pointerId: event.pointerId,
      startHeight: bounds.height,
      startWidth: bounds.width,
      startX: event.clientX,
      startY: event.clientY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const resizeWindow = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const state = resizeState.current;
    const frame = windowRef.current;
    if (!state || !frame || state.pointerId !== event.pointerId) return;

    const stageWidth =
      frame.parentElement?.getBoundingClientRect().width ?? state.startWidth;
    const isCompact = window.matchMedia("(max-width: 720px)").matches;
    const minWidth = Math.min(isCompact ? 280 : 560, stageWidth);
    const nextWidth = Math.min(
      stageWidth,
      Math.max(minWidth, state.startWidth + event.clientX - state.startX),
    );
    const nextHeight = Math.min(
      1080,
      Math.max(420, state.startHeight + event.clientY - state.startY),
    );

    setManualSize({ width: nextWidth, height: nextHeight });
  };

  const stopResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (resizeState.current?.pointerId !== event.pointerId) return;
    resizeState.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const resizeWithKeyboard = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
  ) => {
    if (
      !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
    ) {
      return;
    }

    const frame = windowRef.current;
    if (!frame || isMaximized) return;
    const bounds = frame.getBoundingClientRect();
    const stageWidth =
      frame.parentElement?.getBoundingClientRect().width ?? bounds.width;
    const isCompact = window.matchMedia("(max-width: 720px)").matches;
    const minWidth = Math.min(isCompact ? 280 : 560, stageWidth);
    const step = event.shiftKey ? 48 : 24;
    const widthChange =
      event.key === "ArrowLeft"
        ? -step
        : event.key === "ArrowRight"
          ? step
          : 0;
    const heightChange =
      event.key === "ArrowUp"
        ? -step
        : event.key === "ArrowDown"
          ? step
          : 0;

    setManualSize({
      width: Math.min(
        stageWidth,
        Math.max(minWidth, bounds.width + widthChange),
      ),
      height: Math.min(1080, Math.max(420, bounds.height + heightChange)),
    });
    event.preventDefault();
  };

  return (
    <div className="document-stage">
      <section
        ref={windowRef}
        className={[
          "document-window",
          isMinimized ? "is-minimized" : "",
          isMaximized ? "is-maximized" : "",
          isDragging ? "is-dragging" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={
          isMaximized
            ? undefined
            : {
                ...manualSize,
                transform: `translate3d(${windowPosition.x}px, ${windowPosition.y}px, 0)`,
              }
        }
        aria-label={`${title} 案例展示窗口`}
      >
        <div
          className="document-titlebar"
          role="toolbar"
          aria-label="拖动案例窗口"
          tabIndex={0}
          onPointerDown={startMove}
          onPointerMove={moveWindow}
          onPointerUp={stopMove}
          onPointerCancel={stopMove}
          onKeyDown={moveWithKeyboard}
        >
          <span className="document-title">
            {document ? (
              <FilePdf weight="fill" aria-hidden="true" />
            ) : (
              <ImageSquare weight="fill" aria-hidden="true" />
            )}
            <b>{document ? "CASE-STUDY.PDF" : "PROJECT-PREVIEW.PNG"}</b>
            <i>— {title}</i>
          </span>

          <div className="document-controls" aria-label="窗口控制">
            <button
              type="button"
              aria-label={isMinimized ? "展开展示窗口" : "最小化展示窗口"}
              onClick={() => setIsMinimized((value) => !value)}
            >
              <Minus weight="bold" />
            </button>
            <button
              type="button"
              aria-label={isMaximized ? "还原展示窗口" : "最大化展示窗口"}
              onClick={() => {
                setIsMinimized(false);
                setIsMaximized((value) => !value);
              }}
            >
              <Square weight="regular" />
            </button>
            <Link href="/#work" aria-label="关闭案例并返回作品列表">
              <X weight="bold" />
            </Link>
          </div>
        </div>

        {!isMinimized && (
          <>
            <div className="document-menu" aria-label="展示窗口菜单">
              {document ? (
                <a href={document} download>
                  FILE
                </a>
              ) : (
                <span>FILE</span>
              )}
              <button
                type="button"
                onClick={() => setIsMaximized((value) => !value)}
              >
                VIEW
              </button>
              <span>100%</span>
              <span>HELP</span>
            </div>

            <div className="document-canvas">
              {document ? (
                <object
                  data={document}
                  type="application/pdf"
                  aria-label={`${title} PDF 案例`}
                >
                  <img src={image} alt={`${title} 项目预览`} />
                </object>
              ) : (
                <img
                  className="case-detail-image"
                  src={image}
                  alt={`${title} 项目预览`}
                />
              )}
            </div>

            <div className="document-status">
              <span>READY</span>
              <span>DRAG TITLE TO MOVE · CORNER TO RESIZE</span>
            </div>
            <button
              className="document-resize-handle"
              type="button"
              aria-label="拖拽调整展示窗口大小"
              title="拖拽调整窗口大小；双击恢复默认尺寸"
              onDoubleClick={() => setManualSize({})}
              onPointerDown={startResize}
              onPointerMove={resizeWindow}
              onPointerUp={stopResize}
              onPointerCancel={stopResize}
              onKeyDown={resizeWithKeyboard}
            >
              <ArrowsOutSimple weight="bold" aria-hidden="true" />
            </button>
          </>
        )}
      </section>
    </div>
  );
}
