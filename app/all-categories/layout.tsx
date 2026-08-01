import MainLayout from "@/shared/components/layouts/main-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "All categories | NNQA Store",
    description:
        "You can look for the categories.",

    keywords: [
        "categories",
        "all categories",
        "NNQA Store",
        "ecommerce login",
        "user account",
    ],

    authors: [{ name: "NNQA Store Team" }],

    creator: "NNQA Store",
    publisher: "NNQA Store",

    metadataBase: new URL("https://nnqa-store.com"),

    alternates: {
        canonical: "/login",
    },

    openGraph: {
        title: "All categories | NNQA Store",
        description:
            "You can look for the categories.",
        url: "https://nnqa-store.com/all-categories",
        siteName: "NNQA Store",
        images: [
            {
                url: "/og-login.png",
                width: 1200,
                height: 630,
                alt: "NNQA Store Login",
            },
        ],
        locale: "en_US",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "All categories | NNQA Store",
        description:
            "You can look for the categories.",
        images: ["/og-login.png"],
    },

    robots: {
        index: false,
        follow: false,
    },

    icons: {
        icon: "/favicon.ico",
    },

    category: "authentication",
};
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section>
            <MainLayout className="max-w-7xl px-4 py-12 min-h-svh">
                {children}
            </MainLayout>
        </section>
    );
}