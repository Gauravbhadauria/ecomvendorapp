import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {THEME_COLOR} from '../utils/Colors';
import CustomTextInput from '../images/components/CustomTextInput';
import CustomButton from '../images/components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import Loader from '../images/components/Loader';
const Signup = () => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const registerVendor = () => {
    setVisible(true);
    const userId = uuid.v4();
    firestore()
      .collection('vendors')
      .doc(userId)
      .set({
        name: name,
        email: email,
        mobile: mobile,
        password: password,
        userId: userId,
      })
      .then(res => {
        setVisible(false);
        console.log('user created');
        navigation.goBack();
      })
      .catch(error => {
        setVisible(false);
        console.log(error);
      });
  };
  const validate = () => {
    let valid = true;
    if (name == '') {
      valid = false;
    }
    if (email == '') {
      valid = false;
    }
    if (mobile == '' || mobile.length < 10) {
      valid = false;
    }
    if (password == '') {
      valid = false;
    }
    if (confirmPass == '') {
      valid = false;
    }
    if (password !== confirmPass) {
      valid = false;
    }
    return valid;
  };
  return (
    <View style={styles.container}>
      <Image source={require('../images/banner.jpg')} style={styles.banner} />
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => {
          navigation.goBack();
        }}>
        <Image source={require('../images/back.png')} style={styles.backIcon} />
      </TouchableOpacity>
      <View style={styles.card}>
        <Text style={styles.title}>Sign up</Text>
        <CustomTextInput
          placeholder={'Enter Name'}
          value={name}
          onChangeText={txt => setName(txt)}
        />
        <CustomTextInput
          placeholder={'Enter Email'}
          value={email}
          onChangeText={txt => setEmail(txt)}
        />
        <CustomTextInput
          placeholder={'Enter Mobile'}
          type={'number-pad'}
          value={mobile}
          onChangeText={txt => setMobile(txt)}
        />
        <CustomTextInput
          placeholder={'Enter Password'}
          value={password}
          onChangeText={txt => setPassword(txt)}
        />
        <CustomTextInput
          placeholder={'Enter Confirm Pass'}
          value={confirmPass}
          onChangeText={txt => setConfirmPass(txt)}
        />
        <CustomButton
          title={'Sign Up'}
          onClick={() => {
            if (validate()) {
              registerVendor();
            } else {
              Alert.alert('Please Check Entered Data');
            }
          }}
        />
      </View>
      <Loader visible={visible} />
    </View>
  );
};

export default Signup;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    width: '100%',
    height: 230,
  },
  card: {
    width: '95%',
    alignSelf: 'center',
    height: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    top: 170,
    elevation: 5,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  title: {
    alignSelf: 'center',
    fontSize: 25,
    fontWeight: '500',
    color: THEME_COLOR,
    marginTop: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    left: 20,
  },
  backIcon: {
    width: '50%',
    height: '50%',
  },
});
