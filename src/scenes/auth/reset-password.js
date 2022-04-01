import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Button, Icon, Input, Layout, Text } from '@ui-kitten/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { SafeAreaView } from 'react-native-safe-area-context';

import { functionsService } from '../../services/firebase-service';
import { Logo } from '../../components';
import { resetPasswordSchema } from '../../utils/validations';
import { screens } from '../../app/app-screens';

const initialValues = { password: '' };

const ForgotPasword = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();

  const [currentToken, setCurrentToken] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loadStatus, setLoadStatus] = useState(false);

  const backToLogin = () => {
    navigation.navigate(screens.Login);
  };

  const onResetPasswordButtonPress = async values => {
    const { password } = values;

    try {
      setLoadStatus(true);
      const payload = { password, token: currentToken };
      await functionsService.resetPasswordWithToken(payload);
      navigation.navigate(screens.Login);
    } catch (ex) {
      Alert.alert('Failed to reset password', ex.message);
      setLoadStatus(false);
    }
  };

  useEffect(() => {
    if (route.params?.url) {
      const splittedPaths = route.params.url.split('/');
      const lastPath = splittedPaths[splittedPaths.length - 1];

      if (lastPath) {
        setCurrentToken(lastPath);
      } else {
        setCurrentToken(splittedPaths[splittedPaths.length - 2]);
      }
    }
  }, [route]);

  const onPasswordIconPress = useCallback(() => {
    setPasswordVisible(prev => !prev);
  }, []);

  const renderPasswordIcon = props => (
    <TouchableWithoutFeedback onPress={onPasswordIconPress}>
      <Icon {...props} name={passwordVisible ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={styles.container}>
        <View style={styles.headerContainer}>
          <Logo large />
        </View>

        <Formik
          initialValues={initialValues}
          validationSchema={resetPasswordSchema}
          onSubmit={onResetPasswordButtonPress}
        >
          {({
            values,
            touched,
            errors,
            handleChange,
            handleSubmit,
            handleBlur,
          }) => (
            <>
              <Text style={styles.enterEmailLabel} status="basic">
                {t('rp.enter-password')}
              </Text>

              <View style={styles.formContainer}>
                <Input
                  accessoryRight={renderPasswordIcon}
                  caption={(touched.password && errors.password) || ''}
                  name="password"
                  onBlur={handleBlur('password')}
                  onChangeText={handleChange('password')}
                  placeholder={t('rp.password')}
                  secureTextEntry={!passwordVisible}
                  size="large"
                  status="basic"
                  style={styles.passwordInput}
                  value={values.password}
                />
              </View>

              <Button disabled={loadStatus} size="large" onPress={handleSubmit}>
                {t('rp.reset-password-upper')}
              </Button>

              <Button
                style={styles.backToLogin}
                appearance="ghost"
                status="basic"
                onPress={backToLogin}
              >
                {t('rp.back-to-login')}
              </Button>
            </>
          )}
        </Formik>
      </Layout>
    </SafeAreaView>
  );
};

export default ForgotPasword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  headerContainer: {
    // marginTop: 25,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 24,
  },
  forgotPasswordLabel: {
    zIndex: 1,
    alignSelf: 'center',
    marginTop: 24,
  },
  enterEmailLabel: {
    zIndex: 1,
    alignSelf: 'center',
    marginTop: 64,
  },
  backToLogin: {
    marginTop: 16,
  },
});
