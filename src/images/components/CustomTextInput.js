import {Dimensions, StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';

const CustomTextInput = ({placeholder, value, onChangeText, type}) => {
  return (
    <View style={styles.input}>
      <TextInput
        placeholder={placeholder}
        value={value}
        keyboardType={type ? type : 'default'}
        onChangeText={txt => {
          onChangeText(txt);
        }}
      />
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  input: {
    width: Dimensions.get('window').width - 50,
    height: 50,
    borderWidth: 0.5,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
    paddingLeft: 20,
  },
});
