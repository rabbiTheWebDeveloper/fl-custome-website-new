import { CategoryCard } from "./category-card"
import { getTranslations } from "next-intl/server"
import { ICategory } from "../../types/categories"

interface CategoriesSectionProps {
  categories: ICategory[]
}

export const CategoriesSection = async ({
  categories,
}: CategoriesSectionProps) => {
  const t = await getTranslations("Theme2.categories")

  // Ensure categories is always an array
  const categoriesArray = Array.isArray(categories) ? categories : []

  return (
    <section className="py-16">
      <div className="container">
        <h2 className="text-2xl md:text-4xl font-bold mb-8">{t("title")}</h2>
        {categoriesArray.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoriesArray.map((category) => (
              <CategoryCard
                key={category.id}
                name={category.name}
                image={category.wp_category_image_url || category.image || ""}
                href={`/categories/${category.slug}`}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No categories available.</p>
        )}
      </div>
    </section>
  )
}
