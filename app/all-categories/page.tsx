import { toCategoryCards } from "@/domains/category/mappers/categories-card.mapper";
import CategoriesPage from "@/domains/category/pages";
import { getAllCategories } from "@/domains/category/repositories/categories.repositories";


export default async function Page() {
  const data = await getAllCategories();
  const dataConvert = toCategoryCards(data)
  return (
    <CategoriesPage categories={dataConvert}></CategoriesPage>
  );
}