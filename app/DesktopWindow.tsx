"use client";

import {
  ArrowsInSimple,
  ArrowsOutSimple,
  Minus,
  X,
} from "@phosphor-icons/react";
import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";

const subscribeToClient = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

type DesktopWindowProps = {
  title: string;
  className?: string;
  centered?: boolean;
  topLayer?: boolean;
  visible?: boolean;
  zIndex: number;
  onFocus: () => void;
  onClose: () => void;
  children: ReactNode;
  closeLabel?: string;
};

export function DesktopWindow({
  title,
  className = "",
  centered = false,
  topLayer = false,
  visible = true,
  zIndex,
  onFocus,
  onClose,
  children,
  closeLabel = "Close window",
}: DesktopWindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startLeft: number;
    startTop: number;
    startRight: number;
    startBottom: number;
    originX: number;
    originY: number;
  } | null>(null);
  const resizeRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    maxWidth: number;
    maxHeight: number;
  } | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [anchor, setAnchor] = useState<{ left: number; top: number } | null>(null);
  const [manualSize, setManualSize] = useState<{
    width?: number;
    height?: number;
  }>({});
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const isClient = useSyncExternalStore(
    subscribeToClient,
    getClientSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    const syncFullscreenState = () => {
      setMaximized(document.fullscreenElement === windowRef.current);
    };

    document.addEventListener("fullscreenchange", syncFullscreenState);
    return () => document.removeEventListener("fullscreenchange", syncFullscreenState);
  }, []);

  useEffect(() => {
    if (!maximized || document.fullscreenElement) return;

    const exitFallbackFullscreen = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMaximized(false);
    };

    window.addEventListener("keydown", exitFallbackFullscreen);
    return () => window.removeEventListener("keydown", exitFallbackFullscreen);
  }, [maximized]);

  const toggleFullscreen = async () => {
    const frame = windowRef.current;
    if (!frame) return;

    setMinimized(false);
    if (document.fullscreenElement === frame) {
      await document.exitFullscreen();
      return;
    }

    if (maximized && !document.fullscreenElement) {
      setMaximized(false);
      return;
    }

    try {
      await frame.requestFullscreen();
    } catch {
      setMaximized(true);
    }
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || maximized) return;
    const bounds = windowRef.current?.getBoundingClientRect();
    if (!bounds) return;
    onFocus();
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startLeft: bounds.left,
      startTop: bounds.top,
      startRight: bounds.right,
      startBottom: bounds.bottom,
      originX: position.x,
      originY: position.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const edgeSpace = window.matchMedia("(max-width: 700px)").matches ? 6 : 12;
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    const minDeltaX = edgeSpace - drag.startLeft;
    const maxDeltaX = window.innerWidth - edgeSpace - drag.startRight;
    const minDeltaY = edgeSpace - drag.startTop;
    const maxDeltaY = window.innerHeight - edgeSpace - drag.startBottom;
    setPosition({
      x: drag.originX + Math.min(maxDeltaX, Math.max(minDeltaX, deltaX)),
      y: drag.originY + Math.min(maxDeltaY, Math.max(minDeltaY, deltaY)),
    });
  };

  const stopDragging = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const startResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const frame = windowRef.current;
    if (!frame || maximized) return;
    const bounds = frame.getBoundingClientRect();
    const parentBounds = frame.offsetParent?.getBoundingClientRect();
    const compact = window.matchMedia("(max-width: 700px)").matches;
    const edgeSpace = compact ? 10 : 16;
    onFocus();
    setAnchor({
      left: bounds.left - (parentBounds?.left ?? 0),
      top: bounds.top - (parentBounds?.top ?? 0),
    });
    setPosition({ x: 0, y: 0 });
    resizeRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startWidth: bounds.width,
      startHeight: bounds.height,
      maxWidth: Math.max(180, window.innerWidth - bounds.left - edgeSpace),
      maxHeight: Math.max(160, window.innerHeight - bounds.top - edgeSpace),
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const resizeWindow = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const resize = resizeRef.current;
    if (!resize || resize.pointerId !== event.pointerId) return;
    const compact = window.matchMedia("(max-width: 700px)").matches;
    const minWidth = Math.min(compact ? 280 : 320, resize.maxWidth);
    const minHeight = Math.min(180, resize.maxHeight);
    setManualSize({
      width: Math.min(
        resize.maxWidth,
        Math.max(minWidth, resize.startWidth + event.clientX - resize.startX),
      ),
      height: Math.min(
        resize.maxHeight,
        Math.max(minHeight, resize.startHeight + event.clientY - resize.startY),
      ),
    });
  };

  const stopResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (resizeRef.current?.pointerId !== event.pointerId) return;
    resizeRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const style = {
    "--desk-x": `${position.x}px`,
    "--desk-y": `${position.y}px`,
    "--desk-base-x": anchor || !centered ? "0px" : "-50%",
    "--desk-base-y": anchor || !centered ? "0px" : "-50%",
    zIndex: topLayer ? 1 : zIndex,
    ...(!visible ? { display: "none" } : {}),
    ...(anchor
      ? { left: anchor.left, top: anchor.top, right: "auto", bottom: "auto" }
      : {}),
    ...manualSize,
  } as CSSProperties;

  const windowNode = (
    <div
      ref={windowRef}
      className={`desktop-window ${className} ${minimized ? "is-minimized" : ""} ${
        maximized ? "is-maximized" : ""
      }`}
      style={style}
      aria-hidden={!visible || undefined}
      onPointerDown={onFocus}
    >
      <div
        className="desktop-window-titlebar"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onDoubleClick={() => void toggleFullscreen()}
      >
        <span>{title}</span>
        <div className="desktop-window-controls">
          <button
            type="button"
            aria-label="Minimize window"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => setMinimized((current) => !current)}
          >
            <Minus weight="bold" />
          </button>
          <button
            type="button"
            aria-label={maximized ? "Exit full screen" : "Enter full screen"}
            aria-pressed={maximized}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => void toggleFullscreen()}
          >
            {maximized ? <ArrowsInSimple weight="bold" /> : <ArrowsOutSimple weight="bold" />}
          </button>
          <button
            type="button"
            aria-label={closeLabel}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={onClose}
          >
            <X weight="bold" />
          </button>
        </div>
      </div>
      <div className="desktop-window-body">{children}</div>
      {!minimized && !maximized && (
        <button
          type="button"
          className="desktop-window-resize"
          aria-label="Resize window"
          onDoubleClick={() => setManualSize({})}
          onPointerDown={startResize}
          onPointerMove={resizeWindow}
          onPointerUp={stopResize}
          onPointerCancel={stopResize}
        >
          <ArrowsOutSimple weight="bold" />
        </button>
      )}
    </div>
  );

  if (topLayer && isClient) {
    return createPortal(
      <div
        className="desktop-window-layer"
        data-window-layer={className || undefined}
        style={{ zIndex, display: visible ? undefined : "none" }}
        aria-hidden={!visible || undefined}
      >
        {windowNode}
      </div>,
      document.body,
    );
  }

  return windowNode;
}
