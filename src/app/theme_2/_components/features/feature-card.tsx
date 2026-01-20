import type { ComponentType, SVGProps } from "react"

interface FeatureCardProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  description: string
}

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) => {
  return (
    <div className="bg-[#F9F9F9] rounded-lg p-6">
      <div className="flex mb-4">
        <div className="flex">
          <Icon className="size-8 text-primary" />
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
