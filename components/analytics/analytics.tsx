import { GoogleTagManager } from "./google-tag-manager";
import { MetaPixel } from "./meta-pixel";
import { GoogleAnalytics } from "./google-analytics";

export interface AnalyticsProps {
  gtmId?: string;
  metaPixelId?: string;
  googleAnalyticsId?: string;
}

export function Analytics({ gtmId, metaPixelId, googleAnalyticsId }: AnalyticsProps) {
  return (
    <>
      <GoogleTagManager gtmId={gtmId} />
      <GoogleAnalytics gaId={googleAnalyticsId} />
      <MetaPixel pixelId={metaPixelId} />
    </>
  );
}
