import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
} from 'react-native';
import React, {useState} from 'react';
import CustomTextInput from '../images/components/CustomTextInput';
import CustomButton from '../images/components/CustomButton';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import storage from '@react-native-firebase/storage';
import {utils} from '@react-native-firebase/app';
import Loader from '../images/components/Loader';
import {useNavigation, useRoute} from '@react-navigation/native';
const AddProducts = () => {
  const route = useRoute();
  const [productName, setProductName] = useState(
    route.params.type == 'edit' ? route.params.data._data.productName : '',
  );
  const [productDesc, setProductDesc] = useState(
    route.params.type == 'edit' ? route.params.data._data.productDesc : '',
  );
  const [productPrice, setProductPrice] = useState(
    route.params.type == 'edit' ? route.params.data._data.price : '',
  );
  const [productDiscountPrice, setProductDiscountPrice] = useState(
    route.params.type == 'edit' ? route.params.data._data.discountPrice : '',
  );
  const [visible, setVisible] = useState(false);
  const [inStock, setInStock] = useState(
    route.params.type == 'edit' ? route.params.data._data.inStock : true,
  );
  const navigation = useNavigation();

  const [imageData, setImageData] = useState({
    assets: [
      {
        fileName: '',
        uri:
          route.params.type == 'edit'
            ? route.params.data._data.productImage
            : '',
      },
    ],
  });

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        openGallery();
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const openGallery = async () => {
    const res = await launchImageLibrary({mediaType: 'photo'});
    if (!res.didCancel) {
      console.log(res);
      setImageData(res);
    }
  };
  const saveProduct = async () => {
    setVisible(true);
    const name = await AsyncStorage.getItem('NAME');
    const userId = await AsyncStorage.getItem('USERID');

    const productId = uuid.v4();
    let url = '';
    if (imageData.assets[0].fileName != '') {
      const reference = storage().ref(imageData.assets[0].fileName);

      const pathToFile = imageData.assets[0].uri;
      // uploads file
      await reference.putFile(pathToFile);
      url = await storage().ref(imageData.assets[0].fileName).getDownloadURL();
    }

    console.log(url);
    if (route.params.type == 'edit') {
      firestore()
        .collection('products')
        .doc(route.params.data._data.productId)
        .update({
          productId: route.params.data._data.productId,
          userId: userId,
          addedBy: name,
          productName: productName,
          productDesc: productDesc,
          price: productPrice,
          discountPrice: productDiscountPrice,
          inStock: inStock,
          productImage:
            imageData.assets[0].fileName == ''
              ? route.params.data._data.productImage
              : url,
        })
        .then(res => {
          setVisible(false);
          navigation.goBack();
        })
        .catch(error => {
          console.log(error);
          setVisible(false);
        });
    } else {
      firestore()
        .collection('products')
        .doc(productId)
        .set({
          productId: productId,
          userId: userId,
          addedBy: name,
          productName: productName,
          productDesc: productDesc,
          price: productPrice,
          discountPrice: productDiscountPrice,
          inStock: inStock,
          productImage: url,
        })
        .then(res => {
          setVisible(false);
          navigation.goBack();
        })
        .catch(error => {
          setVisible(false);
        });
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.bannerView}>
        {imageData.assets[0].uri == '' ? (
          <TouchableOpacity
            onPress={() => {
              requestCameraPermission();
            }}>
            <Image
              source={require('../images/camera.png')}
              style={styles.camera}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.banner}
            onPress={() => {
              requestCameraPermission();
            }}>
            <Image
              source={{uri: imageData.assets[0].uri}}
              style={styles.banner}
            />
          </TouchableOpacity>
        )}
      </View>
      <CustomTextInput
        placeholder={' Product Name'}
        value={productName}
        onChangeText={txt => {
          setProductName(txt);
        }}
      />

      <CustomTextInput
        placeholder={'Product Description '}
        value={productDesc}
        onChangeText={txt => {
          setProductDesc(txt);
        }}
      />
      <CustomTextInput
        placeholder={' Price '}
        value={productPrice}
        type={'number-pad'}
        onChangeText={txt => {
          setProductPrice(txt);
        }}
      />
      <CustomTextInput
        placeholder={' Discount Price '}
        value={productDiscountPrice}
        type={'number-pad'}
        onChangeText={txt => {
          setProductDiscountPrice(txt);
        }}
      />
      <View style={styles.stock}>
        <Text>In Stock</Text>
        <Switch
          value={inStock}
          onChange={() => {
            setInStock(!inStock);
          }}
        />
      </View>
      <CustomButton
        title={'Save Product'}
        onClick={() => {
          saveProduct();
        }}
      />
      <Loader visible={visible} />
    </View>
  );
};

export default AddProducts;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerView: {
    width: '90%',
    height: 200,
    borderWidth: 0.5,
    alignSelf: 'center',
    marginTop: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stock: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  camera: {
    width: 50,
    height: 50,
  },
  banner: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});
