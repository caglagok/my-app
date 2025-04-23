{/* 
components/HapticTab.tsx
Amaç: Tab butonlarına basıldığında haptic (dokunsal) geri bildirim ekler. iOS için hafif bir dokunsal geribildirim sağlar.
Ne Yapmalısın?: Eğer tab bar kullanıyorsan ve haptic geri bildirim eklemek istiyorsan, bu bileşeni tutman gerekebilir. Eğer tab yapısından vazgeçtiysen, silebilirsin.

import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}
*/}