import { SingupLayout } from "@/domains/auth/components/signup/layout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up | NNQA Store",
    description:
        "Create your NNQA Store account to shop faster, track orders, save your favorites, and enjoy a personalized shopping experience.",

    keywords: [
        "sign up",
        "register",
        "create account",
        "NNQA Store",
        "ecommerce registration",
        "user account",
    ],

    authors: [{ name: "NNQA Store Team" }],

    creator: "NNQA Store",
    publisher: "NNQA Store",

    metadataBase: new URL("https://nnqa-store.com"),

    alternates: {
        canonical: "/sign-up",
    },

    openGraph: {
        title: "Sign Up | NNQA Store",
        description:
            "Create your NNQA Store account and start shopping with personalized recommendations, order tracking, and exclusive offers.",
        url: "https://nnqa-store.com/sign-up",
        siteName: "NNQA Store",
        images: [
            {
                url: "/og-sign-up.png",
                width: 1200,
                height: 630,
                alt: "NNQA Store Sign Up",
            },
        ],
        locale: "en_US",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "Sign Up | NNQA Store",
        description:
            "Create your NNQA Store account and start your shopping journey today.",
        images: ["/og-sign-up.png"],
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
        <SingupLayout>
            {children}
        </SingupLayout>
    );
}