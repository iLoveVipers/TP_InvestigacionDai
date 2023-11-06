import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, Button, View } from 'react-native';
import { useEffect, useState } from 'react';
import * as SMS from 'expo-sms';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';

// expo install expo-sms

export default function App() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(undefined);
  const [recipients, setRecipients] = useState([]);
  const [message, setMessage] = useState(undefined);

  useEffect(() => {
    async function checkAvailability() {
      const isSmsAvailable = await SMS.isAvailableAsync();
      setIsAvailable(isSmsAvailable);
    }
    checkAvailability();
  }, []);

  const sendSms = async () => {
    console.log("Generando pdf");
    const { uri } = await Print.printToFileAsync({
      html: "<h1>Hola test</h1>"
    });

    console.log(uri);

    const contentUri = await FileSystem.getContentUriAsync(uri);
    console.log(contentUri);

    const {result} = await SMS.sendSMSAsync(
      recipients,
      message,
      {
        attachments: {
          uri: contentUri,
          mimeType: "application/pdf",
          filename: "Hi.pdf"
        }
      }
    );

    console.log(result);
  };

  const addNumber = () => {
    let newRecipients = [...recipients];
    newRecipients.push(phoneNumber);
    setRecipients(newRecipients);
    setPhoneNumber(undefined);
  };

  const showRecipients = () => {
    if (recipients.length === 0) {
      return <Text>No hay attachments agregados!</Text>
    }

    return recipients.map((recipient, index) => {
      return <Text key={index}>{recipient}</Text>;
    });
  };

  return (<View style={styles.container}>
    <Text style={styles.heading}>App de Mensajería</Text>
  
    <TextInput
      style={styles.input}
      value={phoneNumber}
      placeholder="Número de Celular"
      onChangeText={(value) => setPhoneNumber(value)}
    />
  
    <Button title="Add Number" onPress={addNumber} />
  
    <TextInput
      style={styles.input}
      value={message}
      placeholder="Mensaje"
      onChangeText={(value) => setMessage(value)}
    />
  
    <Text style={styles.recipientsTitle}>Attachments:</Text>
    {showRecipients()}
  
    <Button title="Limpiar" onPress={() => setRecipients([])} />
  
    {isAvailable ? (
      <Button style={styles.btn} title="Enviar SMS" onPress={sendSms} />
    ) : (
      <Text style={styles.smsNotAvailable}>SMS no disponible</Text>
    )}
  
    <StatusBar style="auto" />
  </View>
  );
}

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
    margin: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
  },
  recipientsTitle: {
    fontSize: 16,
    marginTop: 10,
  },
  smsNotAvailable: {
    fontSize: 16,
    marginTop: 10,
    color: 'red',
  },
  btn: {
    borderRadius: 20,
    backgroundColor: '#5e318f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: '3rem',
    minWidth: '10rem',
    text: 'ffffff',
    color: '#ffffff',
    padding: 10,
    margin: '1rem',
    marginBottom: 30,
  borderRadius: "50px",
  shadowColor: '#000000',
  shadowOffset: {width: 1, height: 5},
  shadowOpacity: 0.2,
  shadowRadius: 17,
  },
};
