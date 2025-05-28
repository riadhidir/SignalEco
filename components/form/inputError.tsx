import { StyleSheet, Text } from "react-native";

type Props = {
  message?: string;
  show: boolean;
};
export default ({ message, show }: Props) => {
  if (!show) return null;
  return <Text style={styles.input}> {message}</Text>;
};

const styles = StyleSheet.create({
  input: {
    color: "red",
  },
});
