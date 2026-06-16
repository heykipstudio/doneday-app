import { useEffect, useRef } from 'react';
import { Animated, Easing, type ImageStyle, type StyleProp } from 'react-native';

type BouncingImageProps = {
  source: number;
  width: number;
  height: number;
  amplitude?: number;
  duration?: number;
  style?: StyleProp<ImageStyle>;
};

export function BouncingImage({
  source,
  width = 250,
  height = 250,
  amplitude = 5,
  duration = 5000,
  style,
}: BouncingImageProps) {
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: -amplitude,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [bounce, amplitude, duration]);

  return (
    <Animated.Image
      source={source}
      resizeMode="contain"
      style={[{ width, height, transform: [{ translateY: bounce }] }, style]}
    />
  );
}
