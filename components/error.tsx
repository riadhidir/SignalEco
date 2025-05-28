import { Button, StyleSheet, Text, View } from "react-native";

type Props = {
  retry?: () => void;
  message?: string;
};
const Error = ({ retry, message }: Props) => {
  return (
    <View style={styles.container}>
      <Text> {message ?? "Error Occured"}</Text>
      {retry && <Button title="retry" onPress={retry} />}
    </View>
  );
};

export default Error;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
