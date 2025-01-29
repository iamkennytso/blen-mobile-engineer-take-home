import TaskEditor from '@/components/taskEditor';
import { TaskMode } from '@/constants/consts';
import { View } from 'react-native';

export default function Add(): JSX.Element {
  return (
    <View className="flex-[1] bg-lt-bg dark:bg-dk-bg items-center w-full">
      <TaskEditor mode={TaskMode.Add} />
    </View>
  );
}
