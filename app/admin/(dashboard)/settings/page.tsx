"use client";

import { useEffect, useState, useRef } from "react";
import { Save, Image as ImageIcon, Globe, Share2, Info, Mail, X, Activity, Sliders } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/admin/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Textarea } from "@/components/admin/ui/textarea";
import { PageHeader } from "@/components/admin/ui/page-header";
import { getSettingsAction, updateSettingsAction } from "@/lib/api/admin/setting-actions";
import { uploadImageAction } from "@/lib/api/image-actions";
import { SyndicationGuideCard } from "@/components/admin/settings/syndication-guide-card";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "tracking">("general");
  const [settings, setSettings] = useState<Record<string, string>>({
    site_name: "",
    site_title: "",
    site_description: "",
    site_keywords: "",
    logo_url: "",
    logo_id: "",
    favicon_url: "",
    favicon_id: "",
    facebook_url: "",
    twitter_url: "",
    youtube_url: "",
    linkedin_url: "",
    contact_email: "",
    contact_phone: "",
    contact_address: "",
    footer_text: "",
    gtm_id: "",
    meta_pixel_id: "",
    google_analytics_id: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [keywordInput, setKeywordInput] = useState("");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const result = await getSettingsAction();
        if (result.success && result.resources) {
          const sanitized = Object.entries(result.resources).reduce((acc, [key, value]) => {
            acc[key] = value ?? "";
            return acc;
          }, {} as Record<string, string>);
          setSettings((prev) => ({ ...prev, ...sanitized }));
        }
      } catch (error) {
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateSettingsAction(settings);
      if (result.success) {
        toast.success("Settings saved successfully");
      } else {
        toast.error(result.message || "Failed to save settings");
      }
    } catch (error) {
      toast.error("An error occurred while saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  const keywords = settings.site_keywords
    ? settings.site_keywords.split(",").map((k) => k.trim()).filter(Boolean)
    : [];

  const addKeyword = (keyword: string) => {
    const trimmed = keyword.trim().replace(/,/g, "");
    if (!trimmed) return;

    if (keywords.includes(trimmed)) {
      setKeywordInput("");
      return;
    }

    const newKeywords = [...keywords, trimmed].join(", ");
    handleChange("site_keywords", newKeywords);
    setKeywordInput("");
  };

  const removeKeyword = (keywordToRemove: string) => {
    const newKeywords = keywords.filter((k) => k !== keywordToRemove).join(", ");
    handleChange("site_keywords", newKeywords);
  };

  const onKeywordInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeyword(keywordInput);
    } else if (e.key === "Backspace" && !keywordInput && keywords.length > 0) {
      removeKeyword(keywords[keywords.length - 1]);
    }
  };

  const handleImageUpload = async (file: File, type: "logo" | "favicon") => {
    const isLogo = type === "logo";
    if (isLogo) setIsUploadingLogo(true);
    else setIsUploadingFavicon(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder_id", ""); // Upload to root

      const result = await uploadImageAction(formData);
      if (result.ok && result.item) {
        handleChange(`${type}_url`, result.item.url);
        handleChange(`${type}_id`, result.item.id);
        toast.success(`${isLogo ? "Logo" : "Favicon"} uploaded successfully`);
      } else {
        toast.error(result.message || `Failed to upload ${type}`);
      }
    } catch (error) {
      toast.error(`An error occurred while uploading ${type}`);
    } finally {
      if (isLogo) setIsUploadingLogo(false);
      else setIsUploadingFavicon(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-6 md:px-6 lg:px-8 bg-slate-50/30 min-h-screen">
      <PageHeader
        title="Site Settings"
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Settings" }]}
        action={
          <Button onClick={handleSave} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700">
            {isSaving ? "Saving..." : "Save Changes"}
            <Save className="ml-2 h-4 w-4" />
          </Button>
        }
      />

      {/* Segmented Tab Navigation */}
      <div className="bg-slate-200/80 p-1.5 rounded-xl border border-slate-300/80 inline-flex items-center gap-1.5 shadow-xs max-w-full overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "general"
              ? "bg-white text-slate-900 font-semibold shadow-xs border border-slate-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 font-medium"
          }`}
        >
          <Sliders className={`w-4 h-4 ${activeTab === "general" ? "text-indigo-600" : "text-slate-500"}`} />
          <span>General Settings</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tracking")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "tracking"
              ? "bg-white text-slate-900 font-semibold shadow-xs border border-slate-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 font-medium"
          }`}
        >
          <Activity className={`w-4 h-4 ${activeTab === "tracking" ? "text-indigo-600" : "text-slate-500"}`} />
          <span>Tracking & Syndication</span>
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
              activeTab === "tracking"
                ? "bg-indigo-50 text-indigo-700 border border-indigo-200/60"
                : "bg-slate-300/70 text-slate-700"
            }`}
          >
            Meta Pixel, RSS
          </span>
        </button>
      </div>

      {/* Tab 1: General Settings */}
      {activeTab === "general" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* General & SEO, Social, Contact */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-200/60 shadow-sm">
              <CardHeader className="flex flex-row items-center space-x-2">
                <Globe className="h-5 w-5 text-indigo-600" />
                <div>
                  <CardTitle className="text-lg">General & SEO</CardTitle>
                  <CardDescription>Configure basic site information and search engine optimization.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="site_name">Site Name</Label>
                    <Input
                      id="site_name"
                      value={settings.site_name}
                      onChange={(e) => handleChange("site_name", e.target.value)}
                      placeholder="e.g. Shikkhapath"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site_title">Site Title</Label>
                    <Input
                      id="site_title"
                      value={settings.site_title}
                      onChange={(e) => handleChange("site_title", e.target.value)}
                      placeholder="e.g. Modern News Portal"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site_description">Site Description</Label>
                  <Textarea
                    id="site_description"
                    value={settings.site_description}
                    onChange={(e) => handleChange("site_description", e.target.value)}
                    placeholder="A brief description for search engines"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site_keywords">SEO Keywords</Label>
                  <div className="flex flex-wrap gap-2 min-h-[42px] p-1.5 border rounded-md bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                    {keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-sm font-medium border border-indigo-100"
                      >
                        {keyword}
                        <button
                          type="button"
                          onClick={() => removeKeyword(keyword)}
                          className="hover:text-indigo-900 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={onKeywordInputKeyDown}
                      onBlur={() => addKeyword(keywordInput)}
                      placeholder={keywords.length === 0 ? "news, education, career (press Enter or Comma)" : ""}
                      className="flex-1 min-w-[120px] bg-transparent outline-hidden text-sm"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">Press Enter or Comma to add keywords.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200/60 shadow-sm">
              <CardHeader className="flex flex-row items-center space-x-2">
                <Share2 className="h-5 w-5 text-indigo-600" />
                <div>
                  <CardTitle className="text-lg">Social Media Links</CardTitle>
                  <CardDescription>Links to your social media profiles.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facebook_url">Facebook URL</Label>
                    <Input
                      id="facebook_url"
                      value={settings.facebook_url}
                      onChange={(e) => handleChange("facebook_url", e.target.value)}
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter_url">Twitter URL</Label>
                    <Input
                      id="twitter_url"
                      value={settings.twitter_url}
                      onChange={(e) => handleChange("twitter_url", e.target.value)}
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube_url">YouTube URL</Label>
                    <Input
                      id="youtube_url"
                      value={settings.youtube_url}
                      onChange={(e) => handleChange("youtube_url", e.target.value)}
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                    <Input
                      id="linkedin_url"
                      value={settings.linkedin_url}
                      onChange={(e) => handleChange("linkedin_url", e.target.value)}
                      placeholder="https://linkedin.com/..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200/60 shadow-sm">
              <CardHeader className="flex flex-row items-center space-x-2">
                <Mail className="h-5 w-5 text-indigo-600" />
                <div>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                  <CardDescription>Displayed in the footer and contact pages.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_email">Email Address</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={settings.contact_email}
                      onChange={(e) => handleChange("contact_email", e.target.value)}
                      placeholder="info@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">Phone Number</Label>
                    <Input
                      id="contact_phone"
                      value={settings.contact_phone}
                      onChange={(e) => handleChange("contact_phone", e.target.value)}
                      placeholder="+880 1234 567890"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_address">Address</Label>
                  <Textarea
                    id="contact_address"
                    value={settings.contact_address}
                    onChange={(e) => handleChange("contact_address", e.target.value)}
                    placeholder="Full office address"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="footer_text">Footer Copyright Text</Label>
                  <Input
                    id="footer_text"
                    value={settings.footer_text}
                    onChange={(e) => handleChange("footer_text", e.target.value)}
                    placeholder="© 2024 Shikkhapath. All rights reserved."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Logo & Favicon Sidebar */}
          <div className="space-y-6">
            <Card className="border-slate-200/60 shadow-sm">
              <CardHeader className="flex flex-row items-center space-x-2">
                <ImageIcon className="h-5 w-5 text-indigo-600" />
                <div>
                  <CardTitle className="text-lg">Logo</CardTitle>
                  <CardDescription>Site branding logo.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 border-t">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200">
                    {settings.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={settings.logo_url} alt="Logo" className="max-h-full max-w-full object-contain p-2" />
                    ) : (
                      <div className="text-slate-400 text-sm flex flex-col items-center">
                        <ImageIcon className="h-8 w-8 mb-1 opacity-20" />
                        No logo selected
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={logoInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, "logo");
                    }}
                  />
                  <Button 
                    variant="secondary" 
                    className="w-full border-indigo-100 hover:bg-indigo-50 hover:text-indigo-700 transition-all" 
                    onClick={() => logoInputRef.current?.click()}
                    disabled={isUploadingLogo}
                  >
                    {isUploadingLogo ? "Uploading..." : "Upload Logo"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200/60 shadow-sm">
              <CardHeader className="flex flex-row items-center space-x-2">
                <Info className="h-5 w-5 text-indigo-600" />
                <div>
                  <CardTitle className="text-lg">Favicon</CardTitle>
                  <CardDescription>Browser tab icon (Square PNG).</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 border-t">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200">
                    {settings.favicon_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={settings.favicon_url} alt="Favicon" className="h-10 w-10 object-contain" />
                    ) : (
                      <div className="text-slate-400 text-[10px] flex flex-col items-center">
                        <ImageIcon className="h-5 w-5 mb-1 opacity-20" />
                        No Favicon
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={faviconInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, "favicon");
                    }}
                  />
                  <Button 
                    variant="secondary" 
                    className="w-full border-indigo-100 hover:bg-indigo-50 hover:text-indigo-700 transition-all" 
                    onClick={() => faviconInputRef.current?.click()}
                    disabled={isUploadingFavicon}
                  >
                    {isUploadingFavicon ? "Uploading..." : "Upload Favicon"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Tracking & RSS Syndication */}
      {activeTab === "tracking" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tracking Configuration */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-slate-200/60 shadow-sm">
              <CardHeader className="flex flex-row items-center space-x-2">
                <Activity className="h-5 w-5 text-indigo-600" />
                <div>
                  <CardTitle className="text-lg">Analytics & Tracking</CardTitle>
                  <CardDescription>Meta Pixel, GTM ও GA4 কনফিগারেশন।</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="meta_pixel_id" className="font-semibold text-slate-800">
                    Meta (Facebook) Pixel ID
                  </Label>
                  <Input
                    id="meta_pixel_id"
                    value={settings.meta_pixel_id}
                    onChange={(e) => handleChange("meta_pixel_id", e.target.value)}
                    placeholder="e.g. 123456789012345"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gtm_id" className="font-semibold text-slate-800">
                    Google Tag Manager (GTM) ID
                  </Label>
                  <Input
                    id="gtm_id"
                    value={settings.gtm_id}
                    onChange={(e) => handleChange("gtm_id", e.target.value)}
                    placeholder="e.g. GTM-XXXXXXX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="google_analytics_id" className="font-semibold text-slate-800">
                    GA4 Measurement ID <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
                  </Label>
                  <Input
                    id="google_analytics_id"
                    value={settings.google_analytics_id}
                    onChange={(e) => handleChange("google_analytics_id", e.target.value)}
                    placeholder="e.g. G-XXXXXXXXXX"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isSaving ? "Saving..." : "Save Tracking Settings"}
                    <Save className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RSS Feed & Content Syndication Guide */}
          <div className="lg:col-span-2 space-y-6">
            <SyndicationGuideCard />
          </div>
        </div>
      )}
    </div>
  );
}
