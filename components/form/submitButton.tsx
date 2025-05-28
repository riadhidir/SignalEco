import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

type Props = {
  title: string;
  isPending: boolean;
  onPress: () => void;
};
const SubmitButton = ({ onPress, isPending, title }: Props) => {
  return (
    <TouchableOpacity
      style={[styles.loginButton, isPending && styles.disabledButton]}
      onPress={onPress}
      disabled={isPending}
    >
      {isPending ? (
        <ActivityIndicator color="white" />
      ) : (
        <>
          <Text style={styles.loginButtonText}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default SubmitButton;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00796b",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#455a64",
    textAlign: "center",
  },
  formContainer: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 4,
    marginTop: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: "#263238",
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#00796b",
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00796b",
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    color: "#546e7a",
    marginRight: 4,
  },
  footerLink: {
    color: "#00796b",
    fontWeight: "500",
  },
});
