import { queryClient } from "@/utils/queryClient";
import { showError, showSuccess } from "@/utils/toast";
import { FontAwesome } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState, type ReactNode, type PropsWithChildren } from "react";
import type { StyleProp, TouchableOpacityProps, ViewStyle } from "react-native";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  onConfirm: Function;
  message?: string;
  queryKeyToInvalidate: string;
  trigger?: ReactNode;
  triggerStyles?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

const DeleteModal = ({
  onConfirm,
  message = "Are you sure you want to delete this item?",
  queryKeyToInvalidate,
  disabled,
  trigger,
  triggerStyles,
}: Props) => {
  const [show, setShow] = useState(false);
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: () => onConfirm(),
    onSuccess: () => {
      router.back();
      queryClient.invalidateQueries({ queryKey: [queryKeyToInvalidate] });
      showSuccess("Item deleted successfully");
    },
    onError: () => {
      showError("Something went wrong");
    },
  });
  const onCancel = () => {
    setShow(false);
  };
  return (
    <>
      <TouchableOpacity
        style={triggerStyles ?? styles.deleteButton}
        onPress={() => setShow(true)}
      >
        {trigger ? (
          trigger
        ) : (
          <>
            <FontAwesome name="trash" size={18} color="white" />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </>
        )}
      </TouchableOpacity>

      <Modal
        transparent
        visible={show}
        animationType="fade"
        onRequestClose={onCancel}
      >
        <SafeAreaView style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.message}>{message}</Text>
            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.button, styles.cancel]}
                onPress={onCancel}
                disabled={isPending}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirm]}
                onPress={() => mutate()}
              >
                {isPending ? (
                  <ActivityIndicator color={"white"} size={24} />
                ) : (
                  <Text style={styles.buttonText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default DeleteModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    elevation: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  cancel: {
    backgroundColor: "#ccc",
  },
  confirm: {
    backgroundColor: "#e63946",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f44336",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 5,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "500",
  },
});
