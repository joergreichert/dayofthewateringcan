import useCategories from '@/hooks/useCategories'
import useAppTheme from '@/hooks/useTheme'
import useMapStore from '@/zustand/useMapStore'

interface CategoryColorBgProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  outerClassName?: string
}

const CategoryColorBg = ({ children, outerClassName }: CategoryColorBgProps) => {
  const selectedCategory = useMapStore(state => state.selectedCategory)
  const { getCategoryById } = useCategories()
  const theme = useAppTheme()

  return (
    <div className={`${outerClassName ?? ''}`}>
      <div
        style={{
          backgroundColor: selectedCategory
            ? getCategoryById(selectedCategory.id)?.color
            : (theme.color('mapBg') as string),
        }}
        className="absolute inset-0"
      />
      {children}
    </div>
  )
}

export default CategoryColorBg
