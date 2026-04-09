import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | NNQA Store",
    description:
        "Sign in to your NNQA Store account to manage orders, track shipments, and enjoy a personalized shopping experience.",

    keywords: [
        "login",
        "sign in",
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
        title: "Login | NNQA Store",
        description:
            "Access your NNQA Store account to shop faster, track orders, and manage your profile.",
        url: "https://nnqa-store.com/login",
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
        title: "Login | NNQA Store",
        description:
            "Sign in to NNQA Store and continue your shopping journey.",
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
            {children}
        </section>
    );
}