import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Vibration, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(108);
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempTarget, setTempTarget] = useState('108');

  // Load saved data on app start
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedCount = await AsyncStorage.getItem('mantraCount');
        const savedTarget = await AsyncStorage.getItem('mantraTarget');
        
        if (savedCount !== null) setCount(parseInt(savedCount));
        if (savedTarget !== null) {
          setTarget(parseInt(savedTarget));
          setTempTarget(savedTarget);
        }
      } catch (e) {
        console.error('Failed to load data', e);
      }
    };
    
    loadData();
  }, []);

  // Save data when count or target changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('mantraCount', count.toString());
        await AsyncStorage.setItem('mantraTarget', target.toString());
      } catch (e) {
        console.error('Failed to save data', e);
      }
    };
    
    saveData();
    
    // Check if target is reached
    if (count > 0 && count === target) {
      Vibration.vibrate(500); // Vibrate for 500ms
      Alert.alert('Target Reached!', `You've completed ${target} mantras!`, [
        { text: 'OK', onPress: () => {} }
      ]);
    }
  }, [count, target]);

  const incrementCount = () => {
    setCount(prevCount => prevCount + 1);
  };

  const resetCount = () => {
    setCount(0);
  };

  const handleTargetSubmit = () => {
    const newTarget = parseInt(tempTarget);
    if (!isNaN(newTarget) && newTarget > 0) {
      setTarget(newTarget);
      setIsEditingTarget(false);
    } else {
      Alert.alert('Invalid Target', 'Please enter a positive number');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mantra Counter</Text>
      
      <View style={styles.counterContainer}>
        <Text style={styles.countText}>{count}</Text>
        <Text style={styles.targetText}>Target: {target}</Text>
      </View>
      
      <TouchableOpacity style={styles.incrementButton} onPress={incrementCount}>
        <Text style={styles.buttonText}>Count</Text>
      </TouchableOpacity>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.secondaryButton} onPress={resetCount}>
          <Text style={styles.secondaryButtonText}>Reset</Text>
        </TouchableOpacity>
        
        {isEditingTarget ? (
          <View style={styles.targetInputContainer}>
            <TextInput
              style={styles.targetInput}
              keyboardType="numeric"
              value={tempTarget}
              onChangeText={setTempTarget}
              onSubmitEditing={handleTargetSubmit}
              autoFocus
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleTargetSubmit}>
              <Text style={styles.submitButtonText}>Set</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setIsEditingTarget(true)}>
            <Text style={styles.secondaryButtonText}>Set Target</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  counterContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  countText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#4a6fa5',
  },
  targetText: {
    fontSize: 20,
    color: '#666',
    marginTop: 10,
  },
  incrementButton: {
    backgroundColor: '#4a6fa5',
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 50,
    marginBottom: 30,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  secondaryButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    elevation: 2,
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
  },
  targetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  targetInput: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 25,
    width: 80,
    marginRight: 10,
    textAlign: 'center',
    elevation: 2,
  },
  submitButton: {
    backgroundColor: '#4a6fa5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default App;