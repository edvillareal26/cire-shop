"use client";

import { cn } from "cn";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import Image from "next/image";
import { type ReactNode, useEffect, useState } from "react";

import { AutoPlayVideo } from "@/components/ui/auto-play-video";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import type { Image as ImageType, Video } from "@/lib/media/types";

import { GALLERY_BUTTON_CLASS } from "./gallery-button";
import { Lightbox, LightboxTrigger } from "./lightbox";

export type GalleryItem = { image: ImageType; type: "image" } | { type: "video"; video: Video };

interface ProductGalleryProps {
  items: GalleryItem[];
  title: string;
  /** Rendered at the top of the button column. */
  wishlist: ReactNode;
}

function itemKey(item: GalleryItem) {
  return item.type === "image" ? item.image.url : item.video.url;
}

export function ProductGallery({ items, title, wishlist }: ProductGalleryProps) {
  const [track, setTrack] = useState<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const count = items.length;

  // Swiping moves the track directly, so the selected thumbnail follows the scroll position.
  useEffect(() => {
    if (!track) return;
    const sync = () => {
      const width = track.offsetWidth;
      if (width > 0) setIndex(Math.round(track.scrollLeft / width));
    };
    track.addEventListener("scroll", sync, { passive: true });
    return () => track.removeEventListener("scroll", sync);
  }, [track]);

  function show(next: number) {
    if (!track || count === 0) return;
    const target = (next + count) % count;
    track.scrollTo({ behavior: "smooth", left: target * track.offsetWidth });
    setIndex(target);
  }

  return (
    <Lightbox label={title}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-5 sm:gap-x-3.5 sm:gap-y-6">
        <div
          aria-label={`${title} images`}
          aria-roledescription="carousel"
          className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain bg-muted"
          ref={setTrack}
          role="region"
        >
          {count === 0 ? (
            <div className="relative aspect-4/5 w-full shrink-0">
              <ImagePlaceholder className="size-full" />
            </div>
          ) : (
            items.map((item, idx) => (
              <div
                aria-label={`${idx + 1} of ${count}`}
                aria-roledescription="slide"
                className="relative aspect-4/5 w-full shrink-0 snap-start snap-always overflow-hidden"
                key={itemKey(item)}
                role="group"
              >
                {item.type === "image" ? (
                  <LightboxTrigger image={item.image}>
                    <Image
                      alt={item.image.altText || `${title} image ${idx + 1}`}
                      className="object-cover"
                      draggable={false}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      src={item.image.url}
                      {...(idx === 0
                        ? { fetchPriority: "high", loading: "eager", preload: true }
                        : { loading: "lazy" })}
                    />
                  </LightboxTrigger>
                ) : (
                  <AutoPlayVideo
                    className="size-full object-cover"
                    previewImage={
                      item.video.previewImage
                        ? {
                            alt: item.video.previewImage.altText || "",
                            src: item.video.previewImage.url,
                          }
                        : null
                    }
                    previewImageFetchPriority={idx === 0 ? "high" : "auto"}
                    previewImageLoading={idx === 0 ? "eager" : "lazy"}
                    src={item.video.url}
                  />
                )}
              </div>
            ))
          )}
        </div>

        <div className="flex flex-col justify-between gap-3">
          {wishlist}
          {count > 1 ? (
            <div className="grid gap-3 sm:gap-5">
              <button
                aria-label="Previous image"
                className={GALLERY_BUTTON_CLASS}
                onClick={() => show(index - 1)}
                type="button"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                aria-label="Next image"
                className={GALLERY_BUTTON_CLASS}
                onClick={() => show(index + 1)}
                type="button"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          ) : null}
        </div>

        {count > 1 ? (
          <ul className="grid grid-cols-5 gap-3 sm:gap-6">
            {items.map((item, idx) => {
              const preview = item.type === "image" ? item.image : item.video.previewImage;
              return (
                <li key={itemKey(item)}>
                  <button
                    aria-current={idx === index ? "true" : undefined}
                    aria-label={`Show image ${idx + 1}`}
                    className={cn(
                      "relative block aspect-3/4 w-full overflow-hidden bg-muted opacity-60 outline-offset-2 transition-opacity hover:opacity-100",
                      idx === index && "opacity-100 outline-1 outline-foreground",
                    )}
                    onClick={() => show(idx)}
                    type="button"
                  >
                    {preview ? (
                      <Image
                        alt=""
                        className="object-cover"
                        fill
                        sizes="(min-width: 1024px) 8vw, 18vw"
                        src={preview.url}
                      />
                    ) : null}
                    {item.type === "video" ? (
                      <Play className="absolute inset-0 m-auto size-5 fill-cream text-cream drop-shadow" />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </Lightbox>
  );
}
