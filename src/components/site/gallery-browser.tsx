"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { GalleryItemData } from "@/lib/demo-data";

type GalleryBrowserProps = {
  items: GalleryItemData[];
};

export function GalleryBrowser({ items }: GalleryBrowserProps) {
  const categories = useMemo(
    () => ["todas", ...new Set(items.map((item) => item.category))],
    [items],
  );
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [selectedItem, setSelectedItem] = useState<GalleryItemData | null>(null);

  const filtered =
    selectedCategory === "todas"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              selectedCategory === category
                ? "bg-foreground text-white"
                : "border border-line bg-surface text-muted"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedItem(item)}
            className="section-card overflow-hidden rounded-[2rem] text-left"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src={item.imageUrl} alt={item.altText ?? item.title} fill className="object-cover" />
            </div>
            <div className="space-y-2 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-strong">{item.category}</p>
              <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm leading-7 text-muted">{item.description}</p>
            </div>
          </button>
        ))}
      </div>

      {selectedItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white">
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/70 p-2 text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="grid md:grid-cols-[1.2fr,0.8fr]">
              <div className="relative min-h-[420px]">
                <Image src={selectedItem.imageUrl} alt={selectedItem.altText ?? selectedItem.title} fill className="object-cover" />
              </div>
              <div className="space-y-4 p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-strong">{selectedItem.category}</p>
                <h3 className="font-[family-name:var(--font-geist-mono)] text-4xl text-foreground">{selectedItem.title}</h3>
                <p className="text-base leading-8 text-muted">{selectedItem.description}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
