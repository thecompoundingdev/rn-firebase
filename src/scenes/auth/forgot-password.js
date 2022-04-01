import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { sendPasswordResetEmail } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Logo } from '../../components';
import { forgotPasswordSchema } from '../../utils/validations';
import { auth } from '../../services/firebase-service';
import { screens } from '../../app/app-screens';

import { EmailIcon } from '../../utils/extra/icons';

const initialValues = { email: '' };

const ForgotPasword = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [loadStatus, setLoadStatus] = useState(false);

  const backToLogin = () => {
    navigation.navigate(screens.Login);
  };

  const onResetPasswordButtonPress = async values => {
    const { email } = values;

    try {
      setLoadStatus(true);
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Reset password link has been sent to your email.');
      backToLogin();
    } catch (error) {
      Alert.alert(error.message);
      setLoadStatus(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={styles.container}>
        <View style={styles.headerContainer}>
          <Logo large />
        </View>

        <Formik
          initialValues={initialValues}
          validationSchema={forgotPasswordSchema}
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
                {t('fp.enter-email')}
              </Text>

              <View style={styles.formContainer}>
                <Input
                  accessoryLeft={EmailIcon}
                  autoCapitalize="none"
                  caption={(touched.email && errors.email) || ''}
                  name="email"
                  onBlur={handleBlur('email')}
                  onChangeText={handleChange('email')}
                  placeholder={t('fp.email')}
                  size="large"
                  status="basic"
                  value={values.email}
                />
              </View>

              <Button disabled={loadStatus} size="large" onPress={handleSubmit}>
                {t('fp.get-link-upper')}
              </Button>

              <Button
                style={styles.backToLogin}
                appearance="ghost"
                status="basic"
                onPress={backToLogin}
              >
                {t('fp.back-to-login')}
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
