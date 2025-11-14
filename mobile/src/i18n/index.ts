import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const en = {
  "navigation": {
    "reels": "Reels",
    "explore": "Explore",
    "concierge": "Concierge",
    "bookings": "Bookings",
    "profile": "Profile"
  },
  "reels": {
    "title": "Discover the World",
    "subtitle": "Experience travel through cinematic reels"
  },
  "common": {
    "loading": "Loading...",
    "error": "Error"
  }
};

const ar = {
  "navigation": {
    "reels": "الريلز",
    "explore": "استكشف",
    "concierge": "المساعد الذكي",
    "bookings": "الحجوزات",
    "profile": "الملف الشخصي"
  },
  "reels": {
    "title": "اكتشف العالم",
    "subtitle": "اختبر السفر من خلال الريلز السينمائية"
  },
  "common": {
    "loading": "جاري التحميل...",
    "error": "خطأ"
  }
};

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
