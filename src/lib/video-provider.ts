export type VideoProviderType = "LOCAL" | "VDOCIPHER" | "BUNNY";

export interface VideoMetadataResult {
  providerVideoId: string;
  duration: number;
  thumbnail?: string;
}

export interface VideoProvider {
  uploadVideo(source?: string): Promise<VideoMetadataResult>;
  getPlaybackUrl(providerVideoId: string): string;
  getVideoMetadata(providerVideoId: string): Promise<{ duration: number; thumbnail?: string }>;
  deleteVideo(providerVideoId: string): Promise<void>;
}

const localSampleVideos = [
  {
    id: "sample-intro",
    url: "/videos/sample-lesson.mp4",
    duration: 135,
    thumbnail: "/images/local-video-thumb.svg",
  },
  {
    id: "sample-build",
    url: "/videos/sample-lesson.mp4",
    duration: 160,
    thumbnail: "/images/local-video-thumb.svg",
  },
  {
    id: "sample-data",
    url: "/videos/sample-lesson.mp4",
    duration: 180,
    thumbnail: "/images/local-video-thumb.svg",
  },
  {
    id: "sample-product",
    url: "/videos/sample-lesson.mp4",
    duration: 210,
    thumbnail: "/images/local-video-thumb.svg",
  },
] as const;

function getStableSampleIndex(providerVideoId: string) {
  if (!providerVideoId) return 0;

  let hash = 0;
  for (let i = 0; i < providerVideoId.length; i += 1) {
    hash = (hash * 31 + providerVideoId.charCodeAt(i)) >>> 0;
  }

  return hash % localSampleVideos.length;
}

/**
 * LocalVideoProvider (Default)
 * Serves videos from /public/videos/ without any third-party external service.
 */
export class LocalVideoProvider implements VideoProvider {
  async uploadVideo(source?: string): Promise<VideoMetadataResult> {
    const providerVideoId = source || `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const sample = localSampleVideos[getStableSampleIndex(providerVideoId)];
    return {
      providerVideoId,
      duration: sample.duration,
      thumbnail: sample.thumbnail,
    };
  }

  getPlaybackUrl(providerVideoId: string): string {
    const sample = localSampleVideos[getStableSampleIndex(providerVideoId)];
    return sample.url;
  }

  async getVideoMetadata(providerVideoId: string): Promise<{ duration: number; thumbnail?: string }> {
    const sample = localSampleVideos[getStableSampleIndex(providerVideoId)];
    return {
      duration: sample.duration,
      thumbnail: sample.thumbnail,
    };
  }

  async deleteVideo(_providerVideoId: string): Promise<void> {
    return;
  }
}

/**
 * BunnyVideoProvider (Future skeleton)
 * Prepared for Bunny Stream CDN (requires BUNNY_API_KEY, BUNNY_LIBRARY_ID, BUNNY_CDN_HOSTNAME).
 * Currently unlinked and defaults to safe no-op or local fallback when unconfigured.
 */
export class BunnyVideoProvider implements VideoProvider {
  private apiKey?: string;
  private libraryId?: string;
  private cdnHostname?: string;

  constructor() {
    this.apiKey = process.env.BUNNY_API_KEY || process.env.VIDEO_PROVIDER_API_KEY;
    this.libraryId = process.env.BUNNY_LIBRARY_ID || process.env.VIDEO_PROVIDER_LIBRARY_ID;
    this.cdnHostname = process.env.BUNNY_CDN_HOSTNAME || "vz-cdn.bunnycdn.com";
  }

  async uploadVideo(source?: string): Promise<VideoMetadataResult> {
    if (!this.apiKey || !this.libraryId) {
      console.warn("[BunnyVideoProvider] Missing API Key/Library ID. Using mock response.");
      return new LocalVideoProvider().uploadVideo(source);
    }
    // Future implementation: POST https://video.bunnycdn.com/library/{libraryId}/videos
    return {
      providerVideoId: `bunny-${Date.now()}`,
      duration: 180,
      thumbnail: `https://${this.cdnHostname}/sample/thumbnail.jpg`,
    };
  }

  getPlaybackUrl(providerVideoId: string): string {
    if (!this.cdnHostname) {
      return new LocalVideoProvider().getPlaybackUrl(providerVideoId);
    }
    // Standard Bunny Stream iframe embed or direct HLS manifest
    return `https://${this.cdnHostname}/${providerVideoId}/playlist.m3u8`;
  }

  async getVideoMetadata(providerVideoId: string): Promise<{ duration: number; thumbnail?: string }> {
    if (!this.apiKey || !this.libraryId) {
      return new LocalVideoProvider().getVideoMetadata(providerVideoId);
    }
    // Future implementation: GET https://video.bunnycdn.com/library/{libraryId}/videos/{videoId}
    return {
      duration: 180,
      thumbnail: `https://${this.cdnHostname}/${providerVideoId}/thumbnail.jpg`,
    };
  }

  async deleteVideo(providerVideoId: string): Promise<void> {
    if (!this.apiKey || !this.libraryId) return;
    // Future implementation: DELETE https://video.bunnycdn.com/library/{libraryId}/videos/{videoId}
    console.log(`[BunnyVideoProvider] Video ${providerVideoId} deleted`);
  }
}

/**
 * VdoCipherVideoProvider (Future skeleton)
 * Prepared for DRM-protected video streaming (requires VDOCIPHER_API_SECRET).
 * Currently unlinked and defaults to safe no-op or local fallback when unconfigured.
 */
export class VdoCipherVideoProvider implements VideoProvider {
  private apiSecret?: string;

  constructor() {
    this.apiSecret = process.env.VDOCIPHER_API_SECRET || process.env.VIDEO_PROVIDER_API_KEY;
  }

  async uploadVideo(source?: string): Promise<VideoMetadataResult> {
    if (!this.apiSecret) {
      console.warn("[VdoCipherVideoProvider] Missing API Secret. Using mock response.");
      return new LocalVideoProvider().uploadVideo(source);
    }
    // Future implementation: PUT credentials request to VdoCipher API
    return {
      providerVideoId: `vdo-${Date.now()}`,
      duration: 180,
      thumbnail: "/images/local-video-thumb.svg",
    };
  }

  getPlaybackUrl(providerVideoId: string): string {
    if (!this.apiSecret) {
      return new LocalVideoProvider().getPlaybackUrl(providerVideoId);
    }
    // Standard VdoCipher OTP / playback info request URL
    return `https://player.vdocipher.com/v2/?otp=mock_otp&playbackInfo=mock_info&video=${providerVideoId}`;
  }

  async getVideoMetadata(providerVideoId: string): Promise<{ duration: number; thumbnail?: string }> {
    if (!this.apiSecret) {
      return new LocalVideoProvider().getVideoMetadata(providerVideoId);
    }
    // Future implementation: GET https://dev.vdocipher.com/api/videos/{videoId}
    return {
      duration: 180,
      thumbnail: "/images/local-video-thumb.svg",
    };
  }

  async deleteVideo(providerVideoId: string): Promise<void> {
    if (!this.apiSecret) return;
    // Future implementation: DELETE https://dev.vdocipher.com/api/videos/{videoId}
    console.log(`[VdoCipherVideoProvider] Video ${providerVideoId} deleted`);
  }
}

/**
 * Factory to resolve active video provider
 */
export function getVideoProviderInstance(type?: VideoProviderType): VideoProvider {
  const envType = (process.env.VIDEO_PROVIDER || "LOCAL").toUpperCase() as VideoProviderType;
  const resolvedType = type || envType;

  switch (resolvedType) {
    case "BUNNY":
      return new BunnyVideoProvider();
    case "VDOCIPHER":
      return new VdoCipherVideoProvider();
    case "LOCAL":
    default:
      return new LocalVideoProvider();
  }
}

export function getLocalVideoPlaybackUrl(providerVideoId: string): string {
  return getVideoProviderInstance().getPlaybackUrl(providerVideoId);
}
