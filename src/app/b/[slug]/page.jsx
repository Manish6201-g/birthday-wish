import { defaultBirthdayData } from "@/lib/defaultBirthdayData";
import BirthdayView from "@/app/components/BirthdayView";
import NotFoundView from "@/app/components/NotFoundView";

async function getBirthday(slug) {
  const cleanSlug = slug.toLowerCase().trim();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/birthdays/public/${cleanSlug}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      return data.birthday;
    }
  } catch (error) {
    console.error("Fetch birthday error:", error);
  }

  // Graceful fallback for Paaji demo slug if server API is unavailable in build/SSR
  if (cleanSlug === "paaji") {
    return defaultBirthdayData;
  }

  return null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const birthday = await getBirthday(slug);

  if (!birthday) {
    return {
      title: "Birthday Not Found 🎂",
      description: "This birthday celebration page does not exist.",
    };
  }

  const name = birthday.name || "Special Someone";

  return {
    title: `Happy Birthday ${name} 🎂❤️`,
    description: `A special personalized birthday surprise created just for ${name}.`,
    openGraph: {
      title: `Happy Birthday ${name}! 🎉`,
      description: `Celebrate ${name}'s birthday with special memories, countdown, and a heartfelt letter.`,
      type: "website",
    },
  };
}

export default async function PublicBirthdayPage({ params }) {
  const { slug } = await params;
  const birthday = await getBirthday(slug);

  if (!birthday) {
    return <NotFoundView />;
  }

  return <BirthdayView birthday={birthday} />;
}
