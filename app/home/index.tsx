import { Button } from '@/components';
import { Colors } from '@/constants/colors';
import { Theme } from '@/constants/consts';
import { db } from '@/db/client';
import { Task, tasks as tasksSchema } from '@/db/schema';
import dayjs from 'dayjs';
import { Link } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';

type TaskPreview = Pick<Task, 'title' | 'dueDate' | 'id'>;
type TaskListItemProps = {
  task: TaskPreview;
};

function TaskItem({ task: { title, dueDate, id } }: TaskListItemProps): JSX.Element {
  const formattedDueDate = dayjs(dueDate).format('ddd MMM D');
  return (
    <View className="m-4">
      <Button containerClasses="p-6">
        <Link href={`/${id}`} className="flex-[1]">
          <Text className="text-dk-text dark:text-lt-text font-bold">
            {title} -{' '}
            <Text className="text-dk-text dark:text-lt-text font-normal">{formattedDueDate}</Text>
          </Text>
        </Link>
      </Button>
    </View>
  );
}

export default function Home(): JSX.Element {
  const { colorScheme = Theme.Light, toggleColorScheme } = useColorScheme();
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<TaskPreview[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleThemePress = useCallback(() => {
    toggleColorScheme();
  }, []);

  const getTasks = async (initialLoad = false) => {
    if (initialLoad) setLoading(true);
    const tasksPayload = await db
      .select({ title: tasksSchema.title, dueDate: tasksSchema.dueDate, id: tasksSchema.id })
      .from(tasksSchema);
    setTasks(tasksPayload);
    if (initialLoad) setLoading(false);
    return;
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getTasks();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <View className="flex-[1] bg-lt-bg dark:bg-dk-bg items-center w-full">
      <View className="p-2 flex flex-row justify-between w-full">
        <Button text={colorScheme === Theme.Light ? 'Dark' : 'Light'} onPress={handleThemePress} />
        <Button>
          <Link href="/add">
            <Text className="text-dk-text dark:text-lt-text">Add</Text>
          </Link>
        </Button>
      </View>
      {loading ? (
        <View className="flex-[1] justify-center items-center">
          <ActivityIndicator color={Colors[colorScheme].tint} size="large" />
        </View>
      ) : null}
      {tasks.length ? (
        <FlatList
          className="w-full"
          data={tasks}
          renderItem={({ item }) => <TaskItem task={item} />}
          keyExtractor={(task) => String(task.id)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      ) : (
        <Text>No Tasks</Text>
      )}
    </View>
  );
}
