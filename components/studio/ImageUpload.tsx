"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon, Plus, Link as LinkIcon, Smartphone, Camera } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  label?: string;
  images: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  description?: string;
}

export default function ImageUpload({
  label = "Project Screenshots / Photos",
  images = [],
  onChange,
  multiple = true,
  maxFiles = 10,
  description = "Upload high-res screenshots from your phone gallery, camera, or computer.",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (!multiple && files.length > 1) {
      toast.error("Please select only 1 image for this field.");
      return;
    }

    if (multiple && images.length + files.length > maxFiles) {
      toast.error(`Maximum limit is ${maxFiles} images.`);
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      const data = await res.json();
      const newUrls: string[] = data.urls || (data.url ? [data.url] : []);

      if (newUrls.length > 0) {
        if (multiple) {
          onChange([...images, ...newUrls]);
          toast.success(`${newUrls.length} image${newUrls.length > 1 ? "s" : ""} uploaded successfully!`);
        } else {
          onChange([newUrls[0]]);
          toast.success("Image uploaded successfully!");
        }
      }
    } catch (error: unknown) {
      console.error("Upload error:", error);
      const msg = error instanceof Error ? error.message : "Failed to upload image";
      toast.error(msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const handleAddManualUrl = () => {
    if (!manualUrl.trim()) return;
    if (multiple) {
      onChange([...images, manualUrl.trim()]);
    } else {
      onChange([manualUrl.trim()]);
    }
    setManualUrl("");
    setShowManualInput(false);
    toast.success("Image link added");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {label} {multiple && `(${images.length}/${maxFiles})`}
          </label>
          {description && <p className="text-[11px] text-muted-foreground">{description}</p>}
        </div>
        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-accent-dark dark:text-accent-light hover:underline"
        >
          <LinkIcon size={12} />
          <span>{showManualInput ? "Hide Link Input" : "Paste URL"}</span>
        </button>
      </div>

      {/* Manual URL Input Bar */}
      {showManualInput && (
        <div className="flex gap-2 p-2 rounded-lg bg-secondary/40 border border-border">
          <input
            type="text"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://example.com/screenshot.jpg or /images/..."
            className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground outline-none focus:border-accent"
          />
          <button
            type="button"
            onClick={handleAddManualUrl}
            className="rounded-md bg-accent px-3 py-1.5 text-xs font-bold uppercase text-accent-foreground hover:bg-accent-light"
          >
            Add
          </button>
        </div>
      )}

      {/* Upload Dropzone / Tap Target */}
      {(!multiple && images.length === 1) ? null : (
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (!isUploading) handleFiles(e.dataTransfer.files);
          }}
          className={`relative group cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all ${
            isUploading
              ? "border-accent/60 bg-accent/5 pointer-events-none"
              : "border-border hover:border-accent/60 bg-card hover:bg-secondary/30"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="h-7 w-7 animate-spin text-accent-dark dark:text-accent-light" />
              <span className="text-xs font-bold text-foreground animate-pulse">
                Optimizing &amp; Uploading image...
              </span>
              <span className="text-[10px] text-muted-foreground">Auto-orienting for mobile photos</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-accent-dark dark:text-accent-light group-hover:scale-110 transition-transform">
                <Upload size={20} />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-foreground flex items-center justify-center gap-1.5">
                  <span>Tap to choose from Device Gallery / Camera</span>
                  <Camera size={13} className="text-muted-foreground hidden sm:inline" />
                  <Smartphone size={13} className="text-muted-foreground hidden sm:inline" />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Supports JPG, PNG, WebP, HEIC &amp; SVG · Auto-compressed for rapid loading
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Thumbnails Gallery */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
          {images.map((url, idx) => (
            <div
              key={idx}
              className="group relative aspect-video rounded-lg border border-border bg-card overflow-hidden shadow-xs"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Uploaded image ${idx + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Cover/Primary Badge on 1st image */}
              {idx === 0 && multiple && (
                <span className="absolute top-1.5 left-1.5 rounded bg-black/75 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent-light border border-accent/30">
                  Cover
                </span>
              )}

              {/* Remove Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(idx);
                }}
                className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/80 text-white hover:bg-red-600 transition-colors shadow-md"
                title="Remove image"
              >
                <X size={13} />
              </button>
            </div>
          ))}

          {/* If single image, replace button */}
          {!multiple && images.length === 1 && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer aspect-video flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-secondary/30 hover:bg-secondary text-muted-foreground hover:text-foreground text-xs font-bold gap-1 transition-all"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <Plus size={16} />
              <span>Change Image</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
