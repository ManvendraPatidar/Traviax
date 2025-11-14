import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

export const theme = {
  colors,
  typography,
  spacing,
  
  // Animation durations (in milliseconds)
  animation: {
    fast: 150,
    normal: 250,
    slow: 350,
    slower: 500,
  },
  
  // Screen dimensions helpers
  styles: {
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    centerContent: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    row: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
    },
    shadow: {
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  },
  
  screenDimensions: { 
    // Will be set dynamically in App.tsx
    width: 0, 
    height: 0 
  },
};

export type Theme = typeof theme;
export { colors, typography, spacing };
