import { CategoryCard } from "./category-card"
import { getTranslations } from "next-intl/server"

export const CategoriesSection = async () => {
  const t = await getTranslations("Theme2.categories")

  const categories = [
    {
      id: "1",
      name: t("tshirt"),
      image: "/product-placeholder.png",
      href: "/categories/t-shirt",
    },
    {
      id: "2",
      name: t("others"),
      image: "/product-placeholder.png",
      href: "/categories/others",
    },
    {
      id: "3",
      name: t("borka"),
      image: "/product-placeholder.png",
      href: "/categories/borka",
    },
    {
      id: "4",
      name: t("saree"),
      image: "/product-placeholder.png",
      href: "/categories/saree",
    },
  ]

  return (
    <section className="py-16">
      <div className="container">
        <h2 className="text-2xl md:text-4xl font-bold mb-8">{t("title")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              name={category.name}
              image={category.image}
              href={category.href}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
