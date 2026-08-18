import { dbConnect } from "@/lib/mongodb";
import Birthday from "@/models/Birthday";
import { defaultBirthdayData } from "@/lib/defaultBirthdayData";
import BirthdayView from "@/app/components/BirthdayView";
import NotFoundView from "@/app/components/NotFoundView";

async function getBirthday(slug) {
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase().trim();

  try {
    const db = await dbConnect();
    if (db) {
      const birthday = await Birthday.findOne({ slug: cleanSlug }).lean();
      if (birthday) {
        return JSON.parse(JSON.stringify(birthday));
      }
    }
  } catch (error) {
    console.error("Fetch birthday error:", error);
  }

  // Graceful fallback for Paaji demo slug if DB is not populated yet
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
