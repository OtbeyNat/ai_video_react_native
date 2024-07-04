import { useState } from "react";
import {
    FlatList,
    Image,
    ImageBackground,
    Text,
    TouchableOpacity,
  } from "react-native";
import { icons } from "../constants";

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

const Trending = ({ posts }) => {
  return (
    <FlatList
        data={posts}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <Text className="text-3xl text-white">{item.id}</Text>
        )}
    
    />
  )
}

export default Trending