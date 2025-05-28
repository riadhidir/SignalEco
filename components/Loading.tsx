import React, { useEffect, useRef } from "react";
import { Image, Animated, Easing, View, StyleSheet } from "react-native";

const Loading = () => {
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const bounceSequence = Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: -20,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(bounceSequence).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: [{ translateY: bounceAnim }],
        }}
      >
        <Image
          source={require("@/assets/images/recycle-bin.png")}
          style={{
            width: 50,
            height: 50,
          }}
        />
      </Animated.View>
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
});
