import { Colors } from '@/constants/colors';
import { TaskMode, Theme } from '@/constants/consts';
import { db } from '@/db/client';
import { NewTask, Task, tasks } from '@/db/schema';
import { useSelectedTask } from '@/hooks/useSelectedTask';
import dayjs, { Dayjs } from 'dayjs';
import { eq } from 'drizzle-orm';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Switch, Text, TextInput, View } from 'react-native';
import DatePicker, { DateType } from 'react-native-ui-datepicker';
import Button from './button';

type TaskEditorProps = {
  task?: Task | null;
  id?: number;
  mode: TaskMode;
};

type Placeholder = {
  text: string;
  textColor: string;
};
type TaskUpdate = Pick<Task, 'title' | 'description' | 'dueDate' | 'isCompleted'>;
const primaryButtonText: Record<TaskMode, string> = {
  [TaskMode.Add]: 'Add',
  [TaskMode.View]: 'Edit',
  [TaskMode.Edit]: 'Update',
};

const inputContainer = 'w-full my-4 px-4';
const inputClasses = 'h-[40] border w-full px-4 dark:border-dk-text text-lt-text dark:text-dk-text';
const today = dayjs();

export default function TaskEditor({
  task,
  id,
  mode = TaskMode.View,
}: TaskEditorProps): JSX.Element {
  const { colorScheme = Theme.Light } = useColorScheme();
  const [loading, setLoading] = useState<boolean>(mode === TaskMode.View);
  const [title, setTitle] = useState<string>(task?.title || '');
  const [titlePlaceholder, setTitlePlaceholder] = useState<Placeholder>({
    text: 'Title',
    textColor: Colors[colorScheme].tabIconDefault,
  });
  const [description, setDescription] = useState<string>(task?.description || '');
  const [descriptionPlaceholder, setDescriptionPlaceholder] = useState<Placeholder>({
    text: 'Description',
    textColor: Colors[colorScheme].tabIconDefault,
  });
  const [dueDate, setDueDate] = useState<Dayjs | DateType>(task?.dueDate || today);
  const [isCompleted, setIsCompleted] = useState<boolean>(task?.isCompleted || false);

  const isViewMode = mode === TaskMode.View;
  const { setSelectedTask } = useSelectedTask();

  useEffect(() => {
    if (mode === TaskMode.View) {
      (() => {
        const taskPayload = db
          .select()
          .from(tasks)
          .where(eq(tasks.id, Number(id)))
          .get();
        if (taskPayload) {
          const { title, description, dueDate, isCompleted } = taskPayload;
          setTitle(title);
          setDescription(description);
          setDueDate(dueDate);
          setIsCompleted(isCompleted);
          setSelectedTask(taskPayload);
        }

        setLoading(false);
      })();
    }
  }, []);

  const handlePrimaryOnPress = async () => {
    switch (mode) {
      case TaskMode.Add:
        if (!title.trim()) {
          setTitlePlaceholder({
            text: 'Title is required',
            textColor: 'red',
          });
        }
        if (!description.trim()) {
          setDescriptionPlaceholder({
            text: 'Description is required',
            textColor: 'red',
          });
        }
        if (title.trim() && description.trim() && dueDate) {
          const formattedDueDate = dayjs(dueDate).format();
          const newTask: NewTask = {
            title,
            description,
            dueDate: formattedDueDate,
          };
          await db.insert(tasks).values(newTask);
        }
        router.back();
        break;
      case TaskMode.View:
        return router.navigate(`${id}/edit`);
      case TaskMode.Edit:
        const formattedDueDate = dayjs(dueDate).format();
        const updatedFields: TaskUpdate = {
          title,
          description,
          dueDate: formattedDueDate,
          isCompleted,
        };
        await db
          .update(tasks)
          .set(updatedFields)
          .where(eq(tasks.id, Number(id)));
        return router.navigate('/');
      default:
        return;
    }
  };

  const handleDeleteOnPress = async () => {
    await db.delete(tasks).where(eq(tasks.id, Number(id)));
    router.back();
  };

  if (loading) {
    return (
      <View className="flex-[1] bg-lt-bg dark:bg-dk-bg items-center w-full justify-between">
        <ActivityIndicator color={Colors[colorScheme].tint} size="large" />
      </View>
    );
  }

  return (
    <View className="flex-[1] bg-lt-bg dark:bg-dk-bg items-center w-full justify-between">
      <View className="w-full">
        <View className={inputContainer}>
          <TextInput
            className={inputClasses}
            onChangeText={setTitle}
            value={title}
            placeholder={titlePlaceholder.text}
            placeholderTextColor={titlePlaceholder.textColor}
            cursorColor={Colors[colorScheme].tint}
            readOnly={isViewMode}
          />
        </View>
        <View className={`${inputContainer} h-[120]`}>
          <TextInput
            className={`${inputClasses} h-full align-top py-4`}
            multiline
            onChangeText={setDescription}
            value={description}
            placeholder={descriptionPlaceholder.text}
            placeholderTextColor={descriptionPlaceholder.textColor}
            cursorColor={Colors[colorScheme].tint}
            readOnly={isViewMode}
          />
        </View>
        <View className={inputContainer}>
          <Text className="text-lt-text dark:text-dk-text">Due Date:</Text>
          {mode === TaskMode.View ? (
            <Text className="text-lt-text dark:text-dk-text">
              {dayjs(dueDate).format('ddd MMM D')}
            </Text>
          ) : (
            <DatePicker
              minDate={today.subtract(1, 'day')}
              mode="single"
              date={dueDate}
              onChange={({ date }) => setDueDate(date)}
              calendarTextStyle={{ color: Colors[colorScheme].text }}
              headerTextStyle={{ color: Colors[colorScheme].text }}
              weekDaysTextStyle={{ color: Colors[colorScheme].text }}
              headerButtonColor={Colors[colorScheme].tint}
              selectedTextStyle={{ color: Colors[colorScheme].background }}
              selectedItemColor={Colors[colorScheme].tabIconSelected}
            />
          )}
          {mode === TaskMode.View ? (
            <Text className="text-lt-text dark:text-dk-text">{`Is it completed? ${isCompleted ? 'Yes' : 'No'}`}</Text>
          ) : null}
          {mode == TaskMode.Edit ? (
            <View className="flex flex-row justify-between">
              <Text className="text-lt-text dark:text-dk-text align-middle">Completed:</Text>
              <Switch
                trackColor={{
                  true: Colors[colorScheme].tint,
                  false: Colors[colorScheme].tabIconDefault,
                }}
                onValueChange={() => setIsCompleted((val) => !val)}
                value={isCompleted}
                thumbColor={Colors[colorScheme].text}
              />
            </View>
          ) : null}
        </View>
      </View>
      <View className="mb-8">
        <Button
          text={primaryButtonText[mode]}
          containerClasses="mb-8 w-[240]"
          onPress={handlePrimaryOnPress}
        />
        {mode === TaskMode.View ? (
          <Button
            text="Delete"
            containerClasses="w-[240] bg-red-500"
            onPress={handleDeleteOnPress}
          />
        ) : null}
      </View>
    </View>
  );
}
