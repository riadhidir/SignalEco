import InputError from "@/components/form/inputError";
import SubmitButton from "@/components/form/submitButton";
import { useSignIn } from "@/hooks/mutations/useAuthApi";
import { TsignIn, signInSchema } from "@/utils/schemas";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
const SignIn = () => {
  const { navigate } = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<TsignIn>({
    resolver: zodResolver(signInSchema),
  });

  const { mutate, isPending } = useSignIn();
  const onSubmit = (data: TsignIn) => {
    mutate(data);
  };

  return (
    <LinearGradient colors={["#f5f5f5", "#e0f2f1"]} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Header Section */}
            <View style={styles.header}>
              <Image
                source={require("@/assets/images/recycle-bin.png")} // Replace with your admin icon
                style={styles.logo}
              />
              <Text style={styles.title}>Admin Portal</Text>
              <Text style={styles.subtitle}>
                Manage waste collection operations
              </Text>
            </View>

            {/* Form Section */}
            <View style={styles.formContainer}>
              {/* Email Input */}

              <View style={styles.inputContainer}>
                <MaterialIcons name="email" size={20} color="#00796b" />
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Admin email"
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  )}
                  name="email"
                />
              </View>

              <InputError
                show={!!errors.email}
                message={errors.email?.message}
              />

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Feather name="lock" size={20} color="#00796b" />

                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="********"
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                      secureTextEntry={!showPassword}
                    />
                  )}
                  name="password"
                />

                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#00796b"
                  />
                </TouchableOpacity>
              </View>

              <InputError
                show={!!errors.password}
                message={errors.password?.message}
              />
              {/* Forgot Password */}
              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => navigate("/forgotPassword")}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}

              <SubmitButton
                onPress={handleSubmit(onSubmit)}
                isPending={isPending}
                title="Login"
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

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

export default SignIn;
