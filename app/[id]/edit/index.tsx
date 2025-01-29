import TaskEditor from '@/components/taskEditor';
import { TaskMode } from '@/constants/consts';
import { useSelectedTask } from '@/hooks/useSelectedTask';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

export default function ViewTask(): JSX.Element {
  const { selectedTask } = useSelectedTask();
  const { id } = useLocalSearchParams();
  return (
    <View className="flex-[1] bg-lt-bg dark:bg-dk-bg items-center w-full">
      <TaskEditor task={selectedTask} mode={TaskMode.Edit} id={Number(id)} />
    </View>
  );
}
