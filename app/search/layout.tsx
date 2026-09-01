import SearchLayout from "@/shared/components/layouts/search-layout"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <SearchLayout>{children}</SearchLayout>
    </section>
  )
}
