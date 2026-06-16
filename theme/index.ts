import { colors } from './colors';
import { fontFamily, typography } from './typography';
import { radius, spacing, tabBarClearance } from './spacing';

export const theme = {
  colors,
  typography,
  fontFamily,
  spacing,
  radius,
  tabBarClearance,
} as const;

export { colors, typography, fontFamily, spacing, radius, tabBarClearance };
