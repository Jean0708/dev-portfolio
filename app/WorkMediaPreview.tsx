"use client";

/* eslint-disable @next/next/no-img-element -- Placeholder will be replaced by project media. */

import { ClockCountdown, DeviceMobile, FilmStrip, Play } from "@phosphor-icons/react";
import { useState } from "react";

export type VideoActivity = {
  id: string;
  title: string;
  label: string;
  src?: string;
  poster?: string;
};

export function VideoWorkPreview({
  activities,
}: {
  activities: VideoActivity[];
}) {
  const [activeId, setActiveId] = useState(activities[0]?.id ?? "");
  const active =
    activities.find((activity) => activity.id === activeId) ?? activities[0];

  if (!active) return null;

  return (
    <div className="work-video-preview">
      <div className="work-video-browser">
        <div className="work-video-activity-list" aria-label="Video activities">
          {activities.map((activity, index) => (
            <button
              key={activity.id}
              type="button"
              className={activity.id === active.id ? "is-active" : ""}
              onClick={() => setActiveId(activity.id)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{activity.title}</strong>
              {activity.src ? (
                <Play weight="fill" aria-label="Video ready" />
              ) : (
                <ClockCountdown weight="bold" aria-label="Video pending" />
              )}
            </button>
          ))}
        </div>

        <div className="work-video-stage">
          {active.src ? (
            <video
              key={active.src}
              src={active.src}
              poster={active.poster}
              controls
              controlsList="nodownload"
              disablePictureInPicture
              playsInline
              preload="metadata"
              aria-label={active.title}
            />
          ) : (
            <div className="work-video-pending">
              {active.poster ? <img src={active.poster} alt="" /> : null}
              <div>
                <FilmStrip weight="fill" />
                <strong>{active.title}</strong>
                <span>录屏素材将在下一轮内容迭代中接入</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="work-media-status">
        <Play weight="fill" />
        <span>{active.label} / {active.src ? "VIDEO READY" : "MEDIA SLOT READY"}</span>
      </div>
    </div>
  );
}

export function MobileDemoPreview({
  title,
  videoSrc,
  url,
}: {
  title: string;
  videoSrc: string;
  url?: string;
}) {
  return (
    <div className="mobile-demo-preview">
      <div className="mobile-demo-device">
        <span aria-hidden="true" />
        {url ? (
          <iframe
            src={url}
            title={title}
            sandbox="allow-forms allow-same-origin allow-scripts"
          />
        ) : (
          <video
            src={videoSrc}
            title={title}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            controlsList="nodownload"
            disablePictureInPicture
          />
        )}
      </div>
      <div className="work-media-status">
        <DeviceMobile weight="fill" />
        <span>MOBILE DEMO / PORTRAIT / FIXED DEVICE</span>
      </div>
    </div>
  );
}
