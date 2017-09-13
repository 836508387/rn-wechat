import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import CommonTitleBar from '../views/CommonTitleBar';
import LoadingView from '../views/LoadingView';
import StorageUtil from '../utils/StorageUtil';
import utils from '../utils/utils';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  PixelRatio,
  ScrollView,
  WebView,
  Animated,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';

var { width, height } = Dimensions.get('window');

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirmPwd: '',
      showProgress: false
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <CommonTitleBar nav={this.props.navigation} title={"注册"}/>
        <View style={styles.content}>
          {
            this.state.showProgress ? (
              <LoadingView cancel={()=>this.setState({showProgress: false})} />
            ) : (null)
          }
          <Image source={require('../../images/ic_launcher.png')} style={{width: 100, height: 100, marginTop: 100}} />
          <View style={styles.pwdView}>
            <View style={styles.pwdContainer}>
              <Text style={{fontSize: 16}}>　用户名：</Text>
              <TextInput onChangeText={(text)=>{this.setState({username: text})}} style={styles.textInput} underlineColorAndroid="transparent" />
            </View>
            <View style={styles.pwdDivider}></View>
            <View style={styles.pwdContainer}>
              <Text style={{fontSize: 16}}>　　密码：</Text>
              <TextInput secureTextEntry={true} onChangeText={(text)=>{this.setState({password: text})}} style={styles.textInput} underlineColorAndroid="transparent" />
            </View>
            <View style={styles.pwdDivider}></View>
            <View style={styles.pwdContainer}>
              <Text style={{fontSize: 16}}>重复密码：</Text>
              <TextInput secureTextEntry={true} onChangeText={(text)=>{this.setState({confirmPwd: text})}} style={styles.textInput} underlineColorAndroid="transparent" />
            </View>
            <View style={styles.pwdDivider}></View>
            <TouchableOpacity activeOpacity={0.6} onPress={()=>this.register()}>
              <View style={styles.loginBtn}>
                <Text style={{color: '#FFFFFF', fontSize: 16}}>注册</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
  isContainChinese(str) {
    var reg = /[\u4e00-\u9fa5]/g;
    if(reg.test(str)){
        return true;
    }
    return false;
  }
  register() {
    var username = this.state.username;
    var password = this.state.password;
    var confirmPwd = this.state.confirmPwd;
    if (utils.isEmpty(username) || utils.isEmpty(password) || utils.isEmpty(confirmPwd)) {
      ToastAndroid.show('用户名或密码不能为空！', ToastAndroid.SHORT);
      return ;
    }
    if (this.isContainChinese(username)) {
      ToastAndroid.show('用户名不能包含中文！', ToastAndroid.SHORT);
      return ;
    }
    if (username.length > 15) {
      ToastAndroid.show('用户名长度不得大于15个字符！', ToastAndroid.SHORT);
      return ;
    }
    if (password.length < 6) {
      ToastAndroid.show('密码至少需要6个字符！', ToastAndroid.SHORT);
      return ;
    }
    if (password !== confirmPwd) {
      ToastAndroid.show('两次输入的密码不一致！', ToastAndroid.SHORT);
      return ;
    }
    this.setState({showProgress: true});
    //请求服务器注册接口
    var registerUrl = 'http://rnwechat.applinzi.com/register';
    let formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    fetch(registerUrl, {
      method: 'POST',
      body: formData
    }).then((res)=>res.json())
      .then((json)=>{
        this.setState({showProgress: false});
        if (!utils.isEmpty(json)) {
          var msg = json.msg;
          if (json.code === 1) {
            // 注册成功
            ToastAndroid.show(msg, ToastAndroid.SHORT);
            this.setState({showProgress: false});
            // 保存注册的用户名
            StorageUtil.set('username', {'username': username});
            // 关闭当前页面
            this.props.navigation.goBack();
            // 跳转到登录界面
            this.props.navigation.navigate('Login');
          } else {
            ToastAndroid.show(msg, ToastAndroid.SHORT);
          }
        }
      }).catch((e)=>{
        ToastAndroid.show('网络请求出错' + e, ToastAndroid.SHORT);
        console.log(e);
        this.setState({showProgress: false});
      })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  pwdView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 50,
  },
  textInput: {
    flex: 1
  },
  pwdContainer: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    marginLeft: 40,
    marginRight: 40,
  },
  pwdDivider: {
    width: width - 60,
    marginLeft: 30,
    marginRight: 30,
    height: 1,
    backgroundColor: '#00BC0C'
  },
  loginBtn: {
    width: width - 40,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 50,
    height: 50,
    borderRadius: 3,
    backgroundColor: '#00BC0C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  }
});
