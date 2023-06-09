import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useState} from 'react';
import Products from '../tabs/Products';
import Orders from '../tabs/Orders';
import {THEME_COLOR} from '../utils/Colors';
import {useNavigation} from '@react-navigation/native';

const Main = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {selectedTab == 0 ? <Products /> : <Orders />}
      <View style={styles.bottomView}>
        <TouchableOpacity
          onPress={() => {
            setSelectedTab(0);
          }}>
          <Image
            source={require('../images/products.png')}
            style={[
              styles.icons,
              {tintColor: selectedTab == 0 ? THEME_COLOR : 'black'},
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AddProducts', {type: 'new'});
          }}>
          <Image source={require('../images/add.png')} style={styles.add} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelectedTab(1);
          }}>
          <Image
            source={require('../images/orders.png')}
            style={[
              styles.icons,
              {tintColor: selectedTab == 1 ? THEME_COLOR : 'black'},
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Main;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomView: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 5,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  icons: {
    width: 30,
    height: 30,
  },
  add: {
    width: 50,
    height: 50,
  },
});
