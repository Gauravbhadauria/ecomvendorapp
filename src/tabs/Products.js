import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
const Products = () => {
  const [productList, setProductList] = useState([]);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  useEffect(() => {
    getProducts();
  }, [isFocused]);
  const getProducts = async () => {
    const userId = await AsyncStorage.getItem('USERID');
    firestore()
      .collection('products')
      .where('userId', '==', userId)
      .get()
      .then(snapshot => {
        console.log(JSON.stringify(snapshot.docs[0].data()));
        if (snapshot.docs !== []) {
          setProductList(snapshot.docs);
        }
      });
  };
  const deleteItem = item => {
    firestore()
      .collection('products')
      .doc(item._data.productId)
      .delete()
      .then(() => {
        console.log('User deleted!');
        getProducts();
      });
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={productList}
        renderItem={({item, index}) => {
          return (
            <View style={styles.productItem}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={{uri: item._data.productImage}}
                  style={styles.productImage}
                />
                <View style={{marginLeft: 10}}>
                  <Text style={styles.name}>{item._data.productName}</Text>
                  <Text>{item._data.productDesc}</Text>
                  <Text style={{color: 'green'}}>
                    {'INR ' + item._data.price}
                  </Text>
                </View>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('AddProducts', {
                      data: item,
                      type: 'edit',
                    });
                  }}>
                  <Image
                    source={require('../images/edit.png')}
                    style={styles.icon}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{marginTop: 20}}
                  onPress={() => {
                    deleteItem(item);
                  }}>
                  <Image
                    source={require('../images/remove.png')}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default Products;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  productItem: {
    width: Dimensions.get('window').width,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingLeft: 20,
    justifyContent: 'space-between',
    paddingRight: 20,
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  icon: {width: 30, height: 30},
  name: {fontSize: 18, fontWeight: '600'},
});
