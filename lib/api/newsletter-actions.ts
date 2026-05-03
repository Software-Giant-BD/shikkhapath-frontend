"use server";

import { fetchApi } from "./common";

export async function subscribeNewsletterAction(email: string) {
  try {
    const response = await fetchApi("/newsletter-subscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || "দুঃখিত! সাবস্ক্রাইব করা সম্ভব হয়নি।",
      };
    }

    return {
      success: true,
      message: data?.message || "ধন্যবাদ! সফলভাবে সাবস্ক্রাইব করা হয়েছে।",
    };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return {
      success: false,
      message: "সার্ভারের সাথে সংযোগ বিচ্ছিন্ন হয়েছে। আবার চেষ্টা করুন।",
    };
  }
}
