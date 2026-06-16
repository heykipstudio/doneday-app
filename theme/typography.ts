export const fontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
} as const;

export const typography = {
  pageTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: 24,
    letterSpacing: -0.3,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 19.5,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 10,
    letterSpacing: 0.9,
    textTransform: 'uppercase' as const,
  },
} as const;
