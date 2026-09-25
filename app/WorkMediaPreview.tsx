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
  background?: string;
};

export type MobileDemoProject = {
  id: string;
  title: string;
  label: string;
  videoSrc: string;
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
          {active.src && active.background ? (
            <div
              className="work-video-phone-stage"
              style={{ backgroundImage: `url(${active.background})` }}
            >
              <div className="work-video-phone-device">
                <span aria-hidden="true" />
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
              </div>
            </div>
          ) : active.src ? (
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
  projects,
}: {
  projects: MobileDemoProject[];
}) {
  const [activeId, setActiveId] = useState(projects[0]?.id ?? "");
  const active = projects.find((project) => project.id === activeId) ?? projects[0];

  if (!active) return null;

  return (
    <div className="mobile-demo-preview">
      <div className="mobile-demo-browser">
        <div className="mobile-demo-project-list" aria-label="App demo projects">
          {projects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              className={project.id === active.id ? "is-active" : ""}
              onClick={() => setActiveId(project.id)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{project.title}</strong>
              <Play weight="fill" aria-label={`${project.title} demo ready`} />
            </button>
          ))}
        </div>
        <div className="mobile-demo-stage">
          <div className="mobile-demo-device">
            <span aria-hidden="true" />
            <video
              key={active.videoSrc}
              src={active.videoSrc}
              title={active.title}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              controlsList="nodownload"
              disablePictureInPicture
            />
          </div>
        </div>
      </div>
      <div className="work-media-status">
        <DeviceMobile weight="fill" />
        <span>{active.label} / MOBILE DEMO / PORTRAIT</span>
      </div>
    </div>
  );
}
