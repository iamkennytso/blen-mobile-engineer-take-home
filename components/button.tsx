import { ReactNode } from 'react';
import { Pressable, Text } from 'react-native';

type ButtonProps = {
  onPress?: () => void;
  text?: string;
  containerClasses?: string;
  textClasses?: string;
  children?: ReactNode;
};

export default function Button({
  onPress,
  text,
  containerClasses,
  textClasses,
  children,
}: ButtonProps): JSX.Element {
  return (
    <Pressable
      className={`p-2 bg-lt-tint dark:bg-dk-tint rounded-lg ${containerClasses}`}
      onPress={onPress}>
      {text ? (
        <Text className={`text-dk-text dark:text-lt-text text-center ${textClasses}`}>{text}</Text>
      ) : null}
      {children}
    </Pressable>
  );
}
