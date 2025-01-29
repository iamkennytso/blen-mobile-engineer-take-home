import TaskEditor from '@/components/taskEditor';
import { TaskMode } from '@/constants/consts';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

export default function ViewTask(): JSX.Element {
  const { id } = useLocalSearchParams();
  return (
    <View className="flex-[1] bg-lt-bg dark:bg-dk-bg items-center w-full">
      <TaskEditor mode={TaskMode.View} id={Number(id)} />
    </View>
  );
}
