import styled from 'styled-components'

import Icon from '@/components/Icon'
import { AppConfig, NavVariant } from '@/lib/AppConfig'
import { ICON } from '@/theme/iconCollection'
import useMapStore from '@/zustand/useMapStore'

import NavItem from './NavItem'

interface StyledListProps {
  $variant: NavVariant
  $isSelectedCategory?: boolean
}

const StyledList = styled.ul<StyledListProps>`
  flex
  h-full
  ${list => {
    const textColor = list.$isSelectedCategory ? `text-white` : `text-dark`

    return list.$variant === NavVariant.TOPNAV
      ? `gap-4 text-lg text-sm md:text-base items-center ${textColor}`
      : 'flex-col justify-between gap-1 w-fit text-primary'
  }}
`

interface NavProps {
  variant?: NavVariant
}

const Nav = ({ variant = NavVariant.INTRO }: NavProps) => {
  const selectedCategory = useMapStore(state => state.selectedCategory)

  return (
    <StyledList $variant={variant} $isSelectedCategory={!!selectedCategory}>
      <NavItem
        href="hhttps://github.com/joergreichert/dayofthewateringcan"
        label="Fork on Github"
        icon={<Icon size={AppConfig.ui.barIconSize} icon={ICON.GITHUB} />}
        external
      />
    </StyledList>
  )
}

export default Nav
